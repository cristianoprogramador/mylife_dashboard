import { PoolConnection, RowDataPacket } from "mysql2/promise";
import pool from "../db";
import bcrypt from "bcrypt";

export const getGoalsService = async (
  email: string,
  year: string
): Promise<RowDataPacket> => {
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM user_goals WHERE email = ? AND ano = ?",
      [email, year]
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

export const saveUserGoals = async (
  email: string,
  year: string,
  goals: any[] // Remove a desestruturação goalsString e mantém como array
) => {
  // console.log(goals);
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    await connection.execute(
      "DELETE FROM user_goals WHERE email = ? AND ano = ?",
      [email, parseInt(year)]
    );

    for (const goal of goals) {
      const { objetivo, mes, ano, valor } = goal;
      await connection.execute(
        "INSERT INTO user_goals (email, objetivo, mes, ano, valor) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE valor = ?",
        [email, objetivo, mes, ano, valor, valor]
      );
    }
    return { message: "Objetivos salvos com sucesso!" };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
