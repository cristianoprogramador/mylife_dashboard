import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, createUserFromProvider } from "@/lib/users";
import { NextAuthOptions } from "next-auth";
import connection from "@/pages/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: "NextAuthCredentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // console.log("TEM ALGO AQUI", credentials);
        try {
          const { email, password } = credentials;
          const user = await loginUser(email, password);
          return user;
        } catch (error) {
          console.error(error);
          throw new Error("Invalid login");
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "credentials") {
        // Use existing login logic for credentials provider
        return true;
      } else {
        const conn = await connection();

        try {
          // Check if user already exists in database
          const [rows] = await conn.execute(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length > 0) {
            const userData = rows[0];
            // console.log("COMO DEVERIA SER", userData);
            return {
              session: {
                name: userData.name,
                email: userData.email,
                image: userData.image,
              },
            };
          }

          // If user doesn't exist, create a new user
          const newUser = await createUserFromProvider({
            name: user.name,
            email: user.email,
            image: user.image,
          });

          if (newUser) {
            // New user created, allow sign in
            return {
              session: {
                name: user.name,
                email: user.email,
                image: user.image,
              },
            };
          }
        } catch (error) {
          console.error(error);
          return false; // Something went wrong, prevent sign in
        } finally {
          conn.end();
        }
      }

      return false; // Default error message if provider is not recognized
    },
  },
};

export default NextAuth(authOptions);
