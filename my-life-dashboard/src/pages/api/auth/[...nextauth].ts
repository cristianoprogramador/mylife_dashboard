// @ts-nocheck

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
        try {
          const { email, password } = credentials;
          console.log(email);
          const response = await axios.post("http://localhost:3030/login", {
            email,
            password,
          });

          console.log(response);

          if (response.status !== 200) {
            throw new Error("Invalid login");
          }

          const user = response.data;
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
    async signIn({
      user,
      account,
      profile,
      email,
      credentials,
    }: any): Promise<any> {
      if (account?.provider === "credentials") {
        // Use existing login logic for credentials provider
        return true;
      } else {
        try {
          const { name, email, image } = user;

          // Check if user already exists in the backend
          const response = await axios.post("http://localhost:3030/userData", {
            email,
          });

          if (response.status === 200) {
            const existingUser = response.data;
            // User already exists, allow sign in
            return {
              session: {
                name: existingUser.name,
                email: existingUser.email,
                image: existingUser.image,
              },
            };
          }

          // If user doesn't exist, create a new user in the backend
          const newUserResponse = await axios.post(
            "http://localhost:3030/userCreate",
            {
              name,
              email,
              password: "", // You should handle the password on the backend side
              image,
            }
          );

          if (newUserResponse.status === 200) {
            const newUser = newUserResponse.data;
            // New user created, allow sign in
            return {
              session: {
                name,
                email,
                image,
              },
            };
          }
        } catch (error) {
          console.error(error);
          return false; // Something went wrong, prevent sign in
        }
      }

      return false; // Default error message if provider is not recognized
    },
  },
};

export default NextAuth(authOptions);
