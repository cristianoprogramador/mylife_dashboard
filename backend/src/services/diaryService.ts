import { PoolConnection, RowDataPacket } from "mysql2/promise";
import pool from "../db";
import bcrypt from "bcrypt";

type DiaryEntry = {
  date: string;
  data: {
    [key: string]: string;
  };
};

export const getDiaryService = async (
  email: string
): Promise<RowDataPacket> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM user_diary WHERE email = ?",
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

export const saveUserDiary = async (
  email: string,
  diaryEntries: DiaryEntry[]
) => {
  // console.log(goals);
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    await connection.execute("DELETE FROM user_diary WHERE email = ?", [email]);

    for (const entry of diaryEntries) {
      const date = entry.date;
      const data = entry.data;
      for (const [type, information] of Object.entries(data)) {
        await connection.execute(
          "INSERT INTO user_diary (email, date, type, information) VALUES (?, ?, ?, ?)",
          [email, date, type, information]
        );
      }
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
