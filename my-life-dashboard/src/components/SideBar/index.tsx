import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { GiPayMoney, GiStairsGoal } from "react-icons/gi";
import { SiSimpleanalytics } from "react-icons/si";
import { SlNotebook } from "react-icons/sl";

export function SideBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Define 640 como o limite para considerar uma tela pequena
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Verifica o tamanho inicial da tela

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // console.log(window.innerWidth);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isMobile) {
    return null; // Retorna null para ocultar o sidebar em telas pequenas
  }

  return (
    <nav
      // className={`h-full flex flex-col gap-7 ${bgColor} `}
      className={` h-full flex flex-col gap-7  ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-800 from-10% via-gray-900 via-30% to-black to-100%"
          : "bg-gradient-to-b from-blue-500 from-10% via-blue-600 via-30% to-blue-600 to-100%"
      }`}
    >
      <Link href="/resume" className="mt-10">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          <AiOutlineHome className="mr-3" size={25} />
          Página Principal
        </button>
      </Link>
      <Link href="/history">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          <GiPayMoney className="mr-3" size={25} />
          Histórico de Gastos
        </button>
      </Link>
      <Link href="/analysis">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          <SiSimpleanalytics className="mr-3" size={25} />
          Análise de Gastos
        </button>
      </Link>
      <Link href="/diary">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          <SlNotebook className="mr-3" size={25} />
          Diário
        </button>
      </Link>
      <Link href="/goals">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          {" "}
          <GiStairsGoal className="mr-3" size={25} />
          Objetivos Mensais
        </button>
      </Link>
      <Link href="/config">
        <button
          className={`${
            theme === "dark"
              ? "p-4 hover:bg-gray-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
              : "p-4 hover:bg-blue-700 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center m-3 transition-colors duration-300"
          }`}
        >
          {" "}
          <AiOutlineSetting className="mr-3" size={25} />
          Configurações
        </button>
      </Link>
    </nav>
  );
}
