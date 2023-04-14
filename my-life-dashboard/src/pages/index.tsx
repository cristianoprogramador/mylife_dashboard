import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <h1>
        Hello Cristiano, seja bem vindo ao seu controle administrativo da sua{" "}
        <strong>VIDA</strong>,
      </h1>
      <h2 className="mt-10 ml-8">
        Clique em um dos botões ao lado esquerdo e pense em como você pode
        MELHORAR! (ou piorar rsrs)
      </h2>
    </div>
  );
}
