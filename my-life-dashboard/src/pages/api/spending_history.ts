import { NextApiRequest, NextApiResponse } from "next";
import connection from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

type RowData = {
  Data: number;
  Descrição: string;
  Obs: string;
  Tipo: string;
  Valor: number;
  Cartão: string;
};

type RequestBody = {
  email: string;
  rowData: RowData[];
};

const saveSpendingHistory = async (email: string, rowData: RowData[]) => {
  const conn = await connection();
  try {
    await conn.execute("DELETE FROM spending_history WHERE email = ?", [email]);

    for (const data of rowData) {
      // Converter a data do formato do Excel para o formato de data do MySQL
      const excelDate = data.Data;
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
      const mysqlDate = jsDate.toISOString().slice(0, 10);

      // Inserir no banco de dados usando a função DATE_FORMAT()
      await conn.execute(
        "INSERT INTO spending_history (email, date, description, obs, type, value, card) VALUES (?, DATE_FORMAT(?, '%Y-%m-%d'), ?, ?, ?, ?, ?)",
        [
          email,
          mysqlDate,
          data.Descrição,
          data.Obs,
          data.Tipo,
          data.Valor,
          data.Cartão,
        ]
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
    const { email, rowData } = req.body as RequestBody;
    try {
      await saveSpendingHistory(email, rowData); // salva as novas informações
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
        "SELECT * FROM spending_history WHERE email = ?",
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
