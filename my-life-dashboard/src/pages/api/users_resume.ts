import { NextApiHandler, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "./db";

const handler: NextApiHandler = async (req, res) => {
  // const session = await getServerSession(req, res, authOptions);
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1]; // Extrai o token do cabeçalho de autorização

  // console.log("CADE O HEADER", token);

  const conn = await connection();

  if (!token) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (req.method === "POST") {
    const {
      conta_corrente,
      investimentos,
      allcards,
      investimentos_no_mes,
      investimentos_na_media,
      salario,
      data_vencimento,
    } = req.body;

    try {
      await conn.execute(
        "INSERT INTO user_resume (email, conta_corrente, investimentos, allcards, investimentos_no_mes, investimentos_na_media, salario, data_vencimento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.query.email,
          conta_corrente,
          investimentos,
          allcards,
          investimentos_no_mes,
          investimentos_na_media,
          salario,
          data_vencimento,
        ]
      );
      conn.end();
      res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      res.status(500).json({ message: "Erro ao salvar dados" });
    }
  } else if (req.method === "PUT") {
    const {
      conta_corrente,
      investimentos,
      allcards,
      investimentos_no_mes,
      investimentos_na_media,
      salario,
      data_vencimento,
    } = req.body;
    try {
      await conn.execute(
        "UPDATE user_resume SET conta_corrente = ?, investimentos = ?, allcards = ?, investimentos_no_mes = ?, investimentos_na_media = ?, salario = ?, data_vencimento = ? WHERE email = ?",
        [
          conta_corrente,
          investimentos,
          allcards,
          investimentos_no_mes,
          investimentos_na_media,
          salario,
          data_vencimento,
          req.query.email,
        ]
      );
      conn.end();
      res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
      res.status(405).json({ message: "Método não permitido" });
    }
  } else if (req.method === "GET") {
    const email = req.query.email as string;
    const conn = await connection();

    try {
      const [rows] = await conn.execute(
        "SELECT * FROM user_resume WHERE email = ?",
        [email]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar objetivos:", error);
      res.status(500).json({ message: "Erro ao buscar objetivos" });
    } finally {
      conn.end();
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
};

export default handler;
