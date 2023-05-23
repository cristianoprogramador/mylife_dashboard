import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { GiPayMoney, GiStairsGoal } from "react-icons/gi";
import { SiSimpleanalytics } from "react-icons/si";
import { SlNotebook } from "react-icons/sl";

export function SideBar() {
  const { theme, setTheme } = useTheme();
  const bgColor =
    theme === "dark"
      ? "bg-gradient-to-b from-gray-800 from-10% via-gray-900 via-30% to-black to-100%"
      : "bg-gradient-to-b from-blue-500 from-10% via-blue-600 via-30% to-blue-600 to-100%";
  const bgColorButton =
    theme === "dark"
      ? "p-4 hover:bg-gray-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
      : "p-4 hover:bg-blue-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300";
  const bgColorButtonDarker =
    theme === "dark"
      ? "p-4 hover:bg-gray-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
      : "p-4 hover:bg-blue-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300";

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700); // Define 640 como o limite para considerar uma tela pequena
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Verifica o tamanho inicial da tela

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log(window.innerWidth);

  if (isMobile) {
    return null; // Retorna null para ocultar o sidebar em telas pequenas
  }

  return (
    <nav className={`h-full ${bgColor} flex flex-col gap-7 `}>
      <Link href="/resume" className="mt-10">
        <button className={`${bgColorButton}`}>
          <AiOutlineHome className="mr-3" size={25} />
          Página Principal
        </button>
      </Link>
      <Link href="/history">
        <button className={`${bgColorButton}`}>
          <GiPayMoney className="mr-3" size={25} />
          Histórico de Gastos
        </button>
      </Link>
      <Link href="/analysis">
        <button className={`${bgColorButton}`}>
          <SiSimpleanalytics className="mr-3" size={25} />
          Análise de Gastos
        </button>
      </Link>
      <Link href="/diary">
        <button className={`${bgColorButtonDarker}`}>
          <SlNotebook className="mr-3" size={25} />
          Diário
        </button>
      </Link>
      <Link href="/goals">
        <button className={`${bgColorButtonDarker}`}>
          <GiStairsGoal className="mr-3" size={25} />
          Objetivos Mensais
        </button>
      </Link>
      <Link href="/config">
        <button className={`${bgColorButtonDarker}`}>
          <AiOutlineSetting className="mr-3" size={25} />
          Configurações
        </button>
      </Link>
    </nav>
  );
}
