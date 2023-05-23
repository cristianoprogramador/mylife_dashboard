import { GitHubCode } from "@/components/GitHubCode";
import LightDarkMode from "@/components/LightDarkMode";
import Profile from "@/components/Profile";
import UserContext from "@/contexts/userContext";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { useState, useContext, useEffect } from "react";
import { FaCog, FaBell, FaUser, FaGithub } from "react-icons/fa";

export default function Config() {
  const Options = [
    { label: "Tema", icon: <FaCog size={25} /> },
    // { label: "Notificações", icon: <FaBell size={25} /> },
    { label: "Dados da Conta", icon: <FaUser size={25} /> },
    { label: "Código no GitHub", icon: <FaGithub size={25} /> },
  ];

  const [selectedOption, setSelectedOption] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOptionClick = (option: any) => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedOption(option);
      setIsVisible(true);
    }, 150);
  };

  const handleGoBackClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      setSelectedOption("");
      setIsVisible(true);
    }, 150);
  };

  const { theme, setTheme } = useTheme();
  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  const renderOptionScreen = () => {
    switch (selectedOption) {
      case "Tema":
        return (
          <div
            className={`p-6 rounded-md transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <LightDarkMode onGoBackClick={handleGoBackClick} />
          </div>
        );
      case "Dados da Conta":
        return (
          <div
            className={`p-6 rounded-md transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            } ${bgColor}`}
          >
            <Profile onGoBackClick={handleGoBackClick} />
          </div>
        );
      case "Código no GitHub":
        return (
          <div
            className={`p-6 rounded-md transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            <GitHubCode onGoBackClick={handleGoBackClick} />
          </div>
        );
      default:
        return (
          <div
            className={`${bgColor} p-6 rounded-lg transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
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

  return (
    <div className="flex flex-1 justify-center items-center">
      <Head>
        <title>Configurações</title>
      </Head>
      {renderOptionScreen()}
    </div>
  );
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
