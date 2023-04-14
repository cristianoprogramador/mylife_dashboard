import type { AppProps } from "next/app";
import "@/styles/global.css";
import Image from "next/image";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  // Aqui você pode definir as informações de login do usuário, como a foto e o nome
  const user = {
    name: "Cristiano",
    photo: "https://avatars.githubusercontent.com/u/102186472?v=4",
  };

  // Aqui você pode definir as opções da barra lateral
  const options = ["Graficos", "Mensagens", "Configurações"];

  return (
    <div className="h-screen flex flex-col">
      {/* Aqui fica o cabeçalho */}
      <header className="h-16 bg-blue-500 flex items-center justify-between px-4 text-white">
        <div className="flex items-center">
          <Image
            src={user.photo}
            width={35}
            height={35}
            style={{ objectFit: "contain", borderRadius: "12px" }}
            alt="thumbnail"
          />
          <h1 className="ml-2">{user.name}</h1>
        </div>
        <button>Logout</button>
      </header>

      {/* Aqui fica o corpo da página */}
      <main className="flex flex-row flex-1">
        {/* Aqui fica a barra lateral */}
        <nav className="w-48 h-full bg-gray-100 flex flex-col">
          <nav className="w-48 h-full bg-gray-100 flex flex-col">
            <Link href="/resume">
              <button className="p-4 hover:bg-gray-200 focus:outline-none">
                Página Principal
              </button>
            </Link>
            <Link href="/history">
              <button className="p-4 hover:bg-gray-200 focus:outline-none">
                Histórico de Gastos
              </button>
            </Link>
            <Link href="/diary">
              <button className="p-4 hover:bg-gray-200 focus:outline-none">
                Diário
              </button>
            </Link>
            <Link href="/config">
              <button className="p-4 hover:bg-gray-200 focus:outline-none">
                Configurações
              </button>
            </Link>
          </nav>
        </nav>

        {/* Aqui fica o conteúdo da página */}
        <div className="flex-1 p-4">
          <Component {...pageProps} />
        </div>
      </main>
    </div>
  );
}

export default MyApp;
