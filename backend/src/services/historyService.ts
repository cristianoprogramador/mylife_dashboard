import { PoolConnection, RowDataPacket } from "mysql2/promise";
import pool from "../db";
import bcrypt from "bcrypt";

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

export const getHistoryService = async (
  email: string
): Promise<RowDataPacket> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM spending_history WHERE email = ?",
      [email]
    );
    const user = rows as RowDataPacket;

    // Retorna um objeto com as informações do usuário
    return user;
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const saveUserHistory = async (email: string, rowData: RowData[]) => {
  // console.log(rowData);
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    await connection.execute("DELETE FROM spending_history WHERE email = ?", [
      email,
    ]);

    for (const data of rowData) {
      // Converter a data do formato do Excel para o formato de data do MySQL
      const excelDate = data.Data;
      const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
      const mysqlDate = jsDate.toISOString().slice(0, 10);

      // Inserir no banco de dados usando a função DATE_FORMAT()
      await connection.execute(
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
    return { message: "Dados salvos com sucesso!" };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
