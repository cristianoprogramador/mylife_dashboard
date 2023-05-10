import UserContext from "@/contexts/userContext";
import Image from "next/image";
import { useContext, useState } from "react";

type GoBackProps = {
  onGoBackClick: () => void;
};

export default function LightDarkMode(props: GoBackProps) {
  const { onGoBackClick } = props;
  const { theme, toggleTheme } = useContext(UserContext);
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (option: string) => {
    setSelectedOption(option);
    toggleTheme(option);
  };

  console.log(theme);

  return (
    <div className="bg-gray-100 p-6 flex flex-col">
      <div className="flex flex-row items-center text-center gap-3 mb-4">
        <button
          onClick={onGoBackClick}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Voltar
        </button>
        <h1 className="text-2xl font-bold">Altere o Tema:</h1>
      </div>
      <div className="flex items-center justify-center  gap-6">
        <label
          htmlFor="darkMode"
          className="flex flex-col items-center cursor-pointer"
        >
          <Image
            src="/noite.jpg"
            width={0}
            height={0}
            sizes="100vw"
            alt="DarkMode"
            style={{
              width: "195px",
              height: "195px",
              objectFit: "fill",
              borderRadius: "30%",
            }}
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
          className="flex flex-col items-center cursor-pointer"
        >
          <Image
            src="/dia.jpg"
            width={0}
            height={0}
            sizes="100vw"
            alt="DarkMode"
            style={{
              width: "195px",
              height: "195px",
              objectFit: "fill",
              borderRadius: "30%",
            }}
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
