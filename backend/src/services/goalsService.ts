import { PoolConnection, RowDataPacket } from "mysql2/promise";
import pool from "../db";
import bcrypt from "bcrypt";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  image: string;
}

interface GoalsInfo {
  email: string;
  year: string;
}

export const getGoalsService = async (
  email: string,
  year: string
): Promise<GoalsInfo> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      throw new Error("Usuário não encontrado");
    }

    const user = rows[0] as RowDataPacket;

    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }

    // Retorna um objeto com as informações do usuário
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
