import type { AppProps } from "next/app";
import "@/styles/global.css";
import Image from "next/image";
import Link from "next/link";
import { GiPayMoney } from "react-icons/gi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { SlNotebook } from "react-icons/sl";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";

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
      <header className="h-16 bg-gradient-to-r from-blue-500 from-20% via-blue-600 via-30% to-blue-600 flex items-center justify-between px-4 text-white rounded-br-2xl">
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
        <div className="flex flex-row cursor-pointer">
          <RiLogoutBoxRLine className="mr-1" size={25} />
          <button>Logout</button>
        </div>
      </header>

      {/* Aqui fica o corpo da página */}
      <main className="flex flex-row flex-1">
        {/* Aqui fica a barra lateral */}
        <nav className="w-60 h-full bg-gradient-to-b from-blue-500 from-10% via-blue-600 via-30% to-blue-600 to-100% flex flex-col gap-7">
          <Link href="/resume">
            <button className="p-4 hover:bg-blue-600 focus:outline-none text-white rounded-full w-full flex items-center mt-10 m-3 hover:shadow-sm">
              <AiOutlineHome className="mr-3" size={25} />
              Página Principal
            </button>
          </Link>
          <Link href="/history">
            <button className="p-4 hover:bg-blue-600 focus:outline-none text-white rounded-full w-full flex items-center m-3 hover:shadow-sm">
              <GiPayMoney className="mr-3" size={25} />
              Histórico de Gastos
            </button>
          </Link>
          <Link href="/diary">
            <button className="p-4 hover:bg-blue-700 focus:outline-none text-white rounded-full w-full flex items-center  m-3 hover:shadow-sm">
              <SlNotebook className="mr-3" size={25} />
              Diário
            </button>
          </Link>
          <Link href="/config">
            <button className="p-4 hover:bg-blue-700 focus:outline-none text-white rounded-full w-full flex items-center m-3 hover:shadow-sm">
              <AiOutlineSetting className="mr-3" size={25} />
              Configurações
            </button>
          </Link>
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
