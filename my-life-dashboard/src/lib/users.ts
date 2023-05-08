import { createConnection, Connection } from "mysql2/promise";
import bcrypt from "bcrypt";

const connection = async (): Promise<Connection> => {
  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

  return createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const conn = await connection();

  try {
    const [rows] = await conn.execute("SELECT id FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length > 0) {
      return { error: "E-mail já existe, tentar outro!" };
    }

    const [result] = await conn.execute(
      "INSERT INTO users (name, email, password, image) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "/person.svg"]
    );

    return { userId: result.insertId };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.end();
  }
};

export const loginUser = async (email: string, password: string) => {
  const conn = await connection();
  try {
    const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      throw new Error("Usuario não encontrado");
    }
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Senha incorreta");
    }
    // Retorna um objeto com as informações do usuário
    return { name: user.name, email: user.email, image: user.image };
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    conn.end();
  }
};
