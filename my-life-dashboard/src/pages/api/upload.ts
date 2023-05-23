import { NextApiHandler, NextApiRequest } from "next";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connection from "./db";
import { OkPacket } from "mysql2";

export const config = {
  api: {
    bodyParser: false,
  },
};

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
  fileName: string;
}> => {
  const options: formidable.Options = {};
  let fileName: string = "";
  if (saveLocally) {
    options.uploadDir = "/tmp"; // Altera o diretório para '/tmp'
    options.filename = (name, ext, path, form) => {
      fileName = Date.now().toString() + "_" + path.originalFilename;

      return fileName;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files, fileName });
    });
  });
};

const updateUserImage = async (email: string, image: string) => {
  try {
    const conn = await connection();
    const [rows] = await conn.execute(
      `UPDATE users SET image = ? WHERE email = ?`,
      ["/images/" + image, email]
    );
    conn.end();
    return (rows as OkPacket).affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
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

  if (req.method === "POST") {
    try {
      const { files, fileName } = await readFile(req, true);
      console.log("Nome do arquivo salvo:", fileName);

      try {
        await updateUserImage(req.query.email as string, fileName);
        res
          .status(200)
          .json({ message: "Dados salvos com sucesso!", fileName: fileName });
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
        res.status(500).json({ message: "Erro ao salvar dados" });
      }
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      res.status(500).json({ message: "Erro ao ler o arquivo" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
