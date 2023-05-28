import { NextApiHandler, NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "./db";

type RequestBody = {
  email: string;
  rowData: any[];
};

const saveExpenses = async (email: string, rowData: any[]) => {
  const conn = await connection();
  try {
    await conn.execute("DELETE FROM user_resume_expenses WHERE email = ?", [
      email,
    ]);

    for (const data of rowData) {
      await conn.execute(
        "INSERT INTO user_resume_expenses (email, expense_type, value) VALUES (?, ?, ?)",
        [email, data.expenseType, data.value]
      );
    }

    console.log("Dados salvos com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar dados:", error);
    throw error;
  } finally {
    conn.end();
  }
};

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
    const { rowData } = req.body as RequestBody;
    const email = req.query.email as string;

    try {
      await saveExpenses(email, rowData); // salva as novas informações
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
        "SELECT * FROM user_resume_expenses WHERE email = ?",
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
