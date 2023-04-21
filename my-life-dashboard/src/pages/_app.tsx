import { Header } from "@/components/Header";
import { SideBar } from "@/components/SideBar";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/global.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* <SessionProvider> */}
      <AuthProvider>
        <Header />
        <main className="flex flex-row flex-1">
          <SideBar />
          <div className="flex-1 p-4 flex justify-center">
            <Component {...pageProps} />
          </div>
        </main>
      </AuthProvider>
      {/* </SessionProvider> */}
    </div>
  );
}

export default MyApp;
