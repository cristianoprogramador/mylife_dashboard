import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "NextAuthCredentials",
      credentials: {},
      async authorize(credentials) {
        // aqui eu faria a autentificação com minha API
        console.log(credentials);

        // await api.post('/signin', credentials)

        return {
          // aqui vc retorna o que vem do backend
          name: "Cristiano",
          email: "cristiano@email.com",
          image:
            "https://yt3.ggpht.com/yti/AHyvSCA5PH0IrMiwSJVIyEq3OHSDNmxxPhilImXoDL5SWg=s88-c-k-c0x00ffffff-no-rj-mo",
        };
      },
    }),
  ],
  secret: process.env.SECRET,
});
