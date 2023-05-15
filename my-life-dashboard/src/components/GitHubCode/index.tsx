import { useTheme } from "next-themes";
import Image from "next/image";

type GoBackProps = {
  onGoBackClick: () => void;
};

export function GitHubCode(props: GoBackProps) {
  const { theme, setTheme } = useTheme();

  const bgColor = theme === "dark" ? "bg-gray-700" : "bg-white";

  const { onGoBackClick } = props;

  return (
    <div className={`${bgColor} p-6 rounded-md`}>
      <div className="flex flex-row items-center text-center gap-3 mb-4">
        <button
          onClick={onGoBackClick}
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
          width={0}
          height={0}
          sizes="100vw"
          style={{
            objectFit: "contain",
            borderRadius: "10px",
            height: "auto",
            width: "600px",
          }}
          alt="github image"
        />
      </a>
    </div>
  );
}
