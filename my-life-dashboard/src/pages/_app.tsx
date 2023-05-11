import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import "@/styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/contexts/userContext";
import { ThemeProvider } from "next-themes";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <div className="h-screen flex flex-col">
      <SessionProvider session={session}>
        <UserProvider>
          <ThemeProvider>
            <Header />
            <main className="flex flex-row flex-1">
              <SideBar />
              <div className="flex-1 p-4 flex justify-center">
                <Component {...pageProps} />
              </div>
            </main>
          </ThemeProvider>
        </UserProvider>
      </SessionProvider>
    </div>
  );
}

export default MyApp;
