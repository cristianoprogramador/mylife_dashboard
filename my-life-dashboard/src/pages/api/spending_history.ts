import { NextApiRequest, NextApiResponse } from "next";
import connection from "../db";
const XLSX = require("xlsx");

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
  if (req.method === "POST") {
    const { email, rowData } = req.body as RequestBody;
    try {
      await saveSpendingHistory(email, rowData);
      res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      res.status(500).json({ message: "Erro ao salvar dados" });
    }
  } else {
    res.status(404).json({ message: "Rota não encontrada" });
  }
}
