import LightDarkMode from "@/components/LightDarkMode";
import Profile from "@/components/Profile";
import UserContext from "@/contexts/userContext";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useState, useContext } from "react";
import { FaCog, FaBell, FaUser, FaGithub } from "react-icons/fa";

export default function Config() {
  const Options = [
    { label: "Tema", icon: <FaCog size={25} /> },
    { label: "Notificações", icon: <FaBell size={25} /> },
    { label: "Dados da Conta", icon: <FaUser size={25} /> },
    { label: "Código no GitHub", icon: <FaGithub size={25} /> },
  ];

  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleGoBackClick = () => {
    setSelectedOption("");
  };

  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  const renderOptionScreen = () => {
    switch (selectedOption) {
      case "Tema":
        return <LightDarkMode onGoBackClick={handleGoBackClick} />;
      case "Notificações":
        return (
          <div className={`${bgColor} p-6 rounded-md`}>
            <h1 className="text-2xl font-bold mb-4">Notificações</h1>
            <p className="text-lg mb-4">
              Aqui você pode configurar as notificações.
            </p>
            <button
              onClick={handleGoBackClick}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            >
              Voltar
            </button>
          </div>
        );
      case "Dados da Conta":
        return <Profile onGoBackClick={handleGoBackClick} />;
      case "Código no GitHub":
        return (
          <div className={`${bgColor} p-6 rounded-md`}>
            <div className="flex flex-row items-center text-center gap-3 mb-4">
              <button
                onClick={handleGoBackClick}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Voltar
              </button>
              <h1 className="text-2xl font-bold">Código no GitHub</h1>
            </div>
            <p className="text-lg mb-4">
              Clique na imagem para visualizar o código do site no GitHub.
            </p>

            <a
              href="https://github.com/cristianoprogramador/mylife_dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/github.jpg"
                width={600}
                height={600}
                style={{ objectFit: "contain", borderRadius: "20px" }}
                alt="github image"
              />
            </a>
          </div>
        );

      default:
        return (
          <div className={`${bgColor} p-6 rounded-lg`}>
            <div className="text-2xl mb-8 font-bold">
              Selecione uma das opções abaixo:
            </div>
            <ul>
              {Options.map((option) => (
                <li
                  key={option.label}
                  onClick={() => handleOptionClick(option.label)}
                  className="flex items-center mb-4 cursor-pointer gap-3"
                >
                  {option.icon}
                  <span className="text-center">{option.label}</span>
                </li>
              ))}
            </ul>
          </div>
        );
    }
  };

  return <div>{renderOptionScreen()}</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  // console.log("CADE A SESSION", session);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
