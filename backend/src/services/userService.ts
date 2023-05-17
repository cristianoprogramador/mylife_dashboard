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

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
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
    const passwordMatch = await bcrypt.compare(password, user.password);

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

export const getUserByEmail = async (email: string): Promise<User> => {
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

    // Retorna um objeto com as informações do usuário
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    };
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const createUserProvider = async (
  name: string,
  email: string,
  password: string,
  image: string
): Promise<{ userId: number }> => {
  const newPassword = "defaultPassword";
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [result] = await connection.execute<RowDataPacket[]>(
      "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, image]
    );

    return { userId: (result as any).insertId };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const createUserWithoutProvider = async (
  name: string,
  email: string,
  password: string
): Promise<{ userId: number }> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  let connection: PoolConnection | undefined;

  try {
    connection = await pool.getConnection();

    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      throw new Error("Email já cadastrado");
    }

    const [result] = await connection.execute<RowDataPacket[]>(
      "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "/person.svg"]
    );

    return { userId: (result as any).insertId };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
