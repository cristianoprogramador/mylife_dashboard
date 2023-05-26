// @ts-nocheck

import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
    secret: "SEGRED12312wOasd3sdas",
    maxAge: 60 * 60 * 24 * 7,
  },
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
            return { name: user.name, email: user.email, image: user.image };
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
    async jwt({ token, account, profile }) {
      // console.log("jwt callback", token, account, profile);
      if (account) {
        token.accessToken = jwt.sign({ sub: account.id }, "seu_secreto");
      }
      // console.log("DENTRO DO NEXTAUTH", token);
      return token;
    },

    session({ session, token, user }) {
      // console.log("session callback", session, token, user);
      if (session.user) {
        session.user.id = user?.id || token?.sub;
      }
      return session;
    },
    async signIn({ user, account, email, credentials }) {
      if (account?.provider === "credentials") {
        // console.log("Vai passar", credentials);
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
            const token = jwt.sign({ email: userData.email }, "seu_secreto");
            return {
              session: {
                user: {
                  name: userData.name,
                  email: userData.email,
                  image: userData.image,
                },
                expires: session.expires,
              },
              token: token,
            };
          }

          const newUser = await createUserFromProvider({
            name: user.name,
            email: user.email,
            image: user.image,
          });

          if (newUser) {
            const token = jwt.sign({ email: newUser.email }, "seu_secreto");
            return {
              session: {
                user: {
                  name: user.name,
                  email: user.email,
                  image: user.image,
                },
                expires: session.expires,
              },
              token: token,
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
