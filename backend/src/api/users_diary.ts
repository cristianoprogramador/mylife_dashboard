import { NextApiRequest, NextApiResponse } from "next";
import connection from "../db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type DiaryEntry = {
  date: string;
  data: {
    [key: string]: string;
  };
};

type RequestBody = {
  email: string;
  diaryEntries: DiaryEntry[];
};

const saveUsersDiary = async (email: string, diaryEntries: any[]) => {
  const conn = await connection();
  try {
    await conn.execute("DELETE FROM user_diary WHERE email = ?", [email]);

    for (const entry of diaryEntries) {
      const date = entry.date;
      const data = entry.data;
      for (const [type, information] of Object.entries(data)) {
        await conn.execute(
          "INSERT INTO user_diary (email, date, type, information) VALUES (?, ?, ?, ?)",
          [email, date, type, information]
        );
      }
    }
    console.log("Dados salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
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
    const { email, diaryEntries } = req.body;
    const parsedDiaryEntries = JSON.parse(diaryEntries);

    try {
      await saveUsersDiary(email, parsedDiaryEntries);
      res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      res.status(500).json({ message: "Erro ao salvar dados" });
    }
  } else if (req.method === "GET") {
    const email = req.query.email as string;
    const conn = await connection();

    try {
      const [rows] = await conn.execute(
        "SELECT * FROM user_diary WHERE email = ?",
        [email]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      res.status(500).json({ message: "Erro ao buscar dados" });
    } finally {
      conn.end();
    }
  } else {
    res.status(404).json({ message: "Rota não encontrada" });
  }
}
