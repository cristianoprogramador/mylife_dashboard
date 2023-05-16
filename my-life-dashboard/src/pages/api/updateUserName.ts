import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "../db";
import { OkPacket } from "mysql2";

export const config = {
  api: {
    bodyParser: true,
  },
};

const updateUser = async (email: string, newName: string) => {
  try {
    const conn = await connection();
    const [rows] = await conn.execute(
      `UPDATE users SET name = ? WHERE email = ?`,
      [newName, email]
    );
    conn.end();
    return (rows as OkPacket).affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const handler: NextApiHandler = async (req, res) => {
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

  if (req.method === "PUT") {
    console.log(req.body);
    if (!req.body || !req.body.name) {
      return res.status(400).json({ message: "Missing name field" });
    }

    const { name } = req.body;
    console.log(name);
    try {
      await updateUser(req.query.email as string, name);
      res.status(200).json({ message: "Dados salvos com sucesso!" });
    } catch (error) {
      console.error("Erro ao salvar dados:", error);
      res.status(500).json({ message: "Erro ao salvar dados" });
    }
  }
};

export default handler;
