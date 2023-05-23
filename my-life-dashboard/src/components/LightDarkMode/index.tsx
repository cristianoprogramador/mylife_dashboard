import UserContext from "@/contexts/userContext";
import Image from "next/image";
import { useContext, useState } from "react";
import { useTheme } from "next-themes";

type GoBackProps = {
  onGoBackClick: () => void;
};

export default function LightDarkMode(props: GoBackProps) {
  const { theme, setTheme } = useTheme();
  const { onGoBackClick } = props;
  const [selectedOption, setSelectedOption] = useState(theme);

  const handleChange = (option: string) => {
    setSelectedOption(option);
    setTheme(option);
  };

  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  return (
    <div className={`${bgColor} p-6 flex flex-col rounded-md`}>
      <div className="flex flex-row items-center text-center gap-3 mb-4">
        <button
          onClick={onGoBackClick}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold">Altere o Tema:</h1>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 m-3 w-fit">
        <label
          htmlFor="darkMode"
          className={`flex flex-col items-center cursor-pointer ${
            selectedOption === "dark"
              ? "border-4 border-blue-900 p-2 rounded-lg"
              : "p-3 "
          }`}
        >
          <Image
            src="/noite.jpg"
            width={0}
            height={0}
            sizes="100vw"
            alt="DarkMode"
            className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full"
            onClick={() => handleChange("dark")}
          />
          <span className="text-lg mt-2">Dark Mode</span>
          <input
            type="radio"
            id="darkMode"
            name="theme"
            value="dark"
            checked={selectedOption === "dark"}
            onChange={() => handleChange("dark")}
            className="sr-only"
          />
        </label>
        <label
          htmlFor="lightMode"
          className={`flex flex-col items-center cursor-pointer ${
            selectedOption === "light"
              ? "border-4 border-blue-300 p-2 rounded-lg"
              : "p-3 "
          }`}
        >
          <Image
            src="/dia.jpg"
            width={0}
            height={0}
            sizes="100vw"
            alt="LightMode"
            className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full"
            onClick={() => handleChange("light")}
          />
          <span className="text-lg mt-2">Light Mode</span>
          <input
            type="radio"
            id="lightMode"
            name="theme"
            value="light"
            checked={selectedOption === "light"}
            onChange={() => handleChange("light")}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
