import { useState } from "react";
import Link from "next/link";

export const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="p-2 text-white rounded-lg focus:outline-none focus:bg-opacity-50"
      >
        Menu
      </button>
      {isOpen && (
        <div className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg">
          <Link href="/resume">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Página Principal
            </button>
          </Link>
          <Link href="/history">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Histórico de Gastos
            </button>
          </Link>
          <Link href="/analysis">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Análise de Gastos
            </button>
          </Link>
          <Link href="/diary">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Diário
            </button>
          </Link>
          <Link href="/goals">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Objetivos Mensais
            </button>
          </Link>
          <Link href="/config">
            <button
              onClick={handleLinkClick}
              className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
            >
              Configurações
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
