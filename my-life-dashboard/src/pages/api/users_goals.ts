import { NextApiRequest, NextApiResponse } from "next";
import connection from "../db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

interface Goal {
  objetivo?: string;
  mes?: string;
  ano?: string;
  valor?: string;
}
[];

const saveUserGoals = async (email: string, goalsString: string) => {
  const goals = JSON.parse(goalsString);
  if (!Array.isArray(goals)) {
    throw new TypeError("Goals is not an array");
  }
  const conn = await connection();
  try {
    for (const goal of goals) {
      const { objetivo, mes, ano, valor } = goal;
      await conn.execute(
        "INSERT INTO user_goals (email, objetivo, mes, ano, valor) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?",
        [email, objetivo, mes, ano, valor, valor]
      );
    }
    console.log("Objetivos salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar objetivos:", error);
    throw error;
  } finally {
    conn.end();
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  if (session.user?.email !== req.query.email) {
    console.log("EMAIL DA SESSAO", session.user?.email);
    console.log(req.query.email);
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "POST") {
    const { email, goals } = req.body;
    try {
      await saveUserGoals(email, goals);
      res.status(200).json({ message: "Objetivos salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar objetivos:", error);
      res.status(500).json({ message: "Erro ao salvar objetivos" });
    }
  } else if (req.method === "GET") {
    const email = req.query.email as string;
    const year = req.query.year as string;
    const conn = await connection();

    try {
      const [rows] = await conn.execute(
        "SELECT * FROM user_goals WHERE email = ? AND ano = ?",
        [email, year]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar objetivos:", error);
      res.status(500).json({ message: "Erro ao buscar objetivos" });
    } finally {
      conn.end();
    }
  } else {
    res.status(404).json({ message: "Rota não encontrada" });
  }
}
