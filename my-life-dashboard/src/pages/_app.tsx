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
            <main className="flex flex-col flex-1">
              <Header />
              <div className="flex-1 gap-4 flex">
                <SideBar />
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
