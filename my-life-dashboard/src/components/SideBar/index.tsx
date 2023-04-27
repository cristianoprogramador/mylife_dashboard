import Link from "next/link";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";
import { GiPayMoney, GiStairsGoal } from "react-icons/gi";
import { SiSimpleanalytics } from "react-icons/si";
import { SlNotebook } from "react-icons/sl";

export function SideBar() {
  return (
    <nav className="w-60 h-full bg-gradient-to-b from-blue-500 from-10% via-blue-600 via-30% to-blue-600 to-100% flex flex-col gap-7">
      <Link href="/resume">
        <button className="p-4 hover:bg-blue-600 hover:shadow-sm focus:outline-none text-white rounded-full w-full flex items-center mt-10 m-3 transition-colors duration-300">
          <AiOutlineHome className="mr-3" size={25} />
          Página Principal
        </button>
      </Link>
      <Link href="/history">
        <button className="p-4 hover:bg-blue-600 focus:outline-none text-white rounded-full w-full flex items-center m-3 hover:shadow-sm transition-colors duration-300">
          <GiPayMoney className="mr-3" size={25} />
          Histórico de Gastos
        </button>
      </Link>
      <Link href="/analysis">
        <button className="p-4 hover:bg-blue-600 focus:outline-none text-white rounded-full w-full flex items-center m-3 hover:shadow-sm transition-colors duration-300">
          <SiSimpleanalytics className="mr-3" size={25} />
          Análise de Gastos
        </button>
      </Link>
      <Link href="/diary">
        <button className="p-4 hover:bg-blue-700 focus:outline-none text-white rounded-full w-full flex items-center  m-3 hover:shadow-sm transition-colors duration-300">
          <SlNotebook className="mr-3" size={25} />
          Diário
        </button>
      </Link>
      <Link href="/goals">
        <button className="p-4 hover:bg-blue-700 focus:outline-none text-white rounded-full w-full flex items-center  m-3 hover:shadow-sm transition-colors duration-300">
          <GiStairsGoal className="mr-3" size={25} />
          Objetivos Mensais
        </button>
      </Link>
      <Link href="/config">
        <button className="p-4 hover:bg-blue-700 focus:outline-none text-white rounded-full w-full flex items-center  m-3 hover:shadow-sm transition-colors duration-300">
          <AiOutlineSetting className="mr-3" size={25} />
          Configurações
        </button>
      </Link>
    </nav>
  );
}
