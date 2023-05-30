// @ts-nocheck

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUserFromProvider, loginUser } from "../usersCreate";
import jwt from "jsonwebtoken";
import connection from "../db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export const authOptions: NextAuthOptions = {
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
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
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const conn = await connection(); // Conecte ao banco de dados

          try {
            const [rows] = await conn.execute(
              "SELECT * FROM users WHERE email = ?",
              [email]
            );
            if (rows.length === 0) {
              throw new Error("Usuario não encontrado");
            }
            const user = rows[0] as User;
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
              throw new Error("Senha incorreta");
            }
            return {
              name: user.name,
              email: user.email,
              image: user.image,
              id: user.id,
            };
          } catch (error) {
            console.error(error);
            throw error;
          } finally {
            conn.end();
          }
        } catch (error) {
          console.error(error);
          throw new Error("Invalid login");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = user?.id || token?.sub;
        session.user.token = token?.accessToken; // Adiciona o token à sessão
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // console.log("jwt callback", token, account, profile);
      if (account) {
        token.accessToken = jwt.sign(
          { sub: account.id },
          process.env.JWT_SECRET
        );
      }
      // console.log("DENTRO DO NEXTAUTH", token);
      return token;
    },

    async signIn({ user, account, email, credentials, session }) {
      if (account?.provider === "credentials") {
        return true;
      } else {
        const conn = await connection();

        try {
          const [rows] = await conn.execute(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length > 0) {
            const userData = rows[0];
            const token = jwt.sign(
              { email: userData.email },
              process.env.JWT_SECRET
            );
            return {
              session: {
                user: {
                  name: userData.name,
                  email: userData.email,
                  image: userData.image,
                  token: token,
                },
                expires: user?.expires, // Use user.expires instead of session.expires
              },
            };
          }

          const newUser = await createUserFromProvider({
            name: user.name,
            email: user.email,
            image: user.image,
          });

          if (newUser) {
            const token = jwt.sign(
              { email: newUser.email },
              process.env.JWT_SECRET
            );
            return {
              session: {
                user: {
                  name: user.name,
                  email: user.email,
                  image: user.image,
                  token: token,
                },
                expires: user?.expires, // Use user.expires instead of session.expires
              },
            };
          }
        } catch (error) {
          console.error(error);
          return false;
        } finally {
          conn.end();
        }
      }

      return false;
    },
  },
};

export default NextAuth(authOptions);
