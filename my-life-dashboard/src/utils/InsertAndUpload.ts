import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import { createConnection } from "mysql2/promise";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFile(file: formidable.File): Promise<string> {
  const oldPath = file.path;
  const newPath = `./public/uploads/${uuidv4()}.${file.name.split(".").pop()}`;

  await fs.promises.rename(oldPath, newPath);

  return newPath;
}

async function insertImage(filePath: string, email: string) {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute(
    "UPDATE users SET image = ? WHERE email = ?",
    [filePath, email]
  );

  await connection.end();

  return rows.affectedRows === 1;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).end("Internal Server Error");
      return;
    }

    const file = files.image;

    const filePath = await uploadFile(file);
    const imageId = await insertImage(filePath);

    res.status(200).json({ message: "success", imageId });
  });
}
