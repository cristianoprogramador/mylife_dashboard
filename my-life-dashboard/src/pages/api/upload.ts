import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import insertImage from "../../utils/InsertAndUpload";
import uploadFile from "../../utils/InsertAndUpload";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    console.log(fields);
    console.log(files);
    const userEmail = req.query.email as string;

    const file = files.file;
    const path = file.path;
    const fileName = file.name;

    const email = userEmail;

    // Salva o arquivo na pasta uploads
    const savedFilePath = await uploadFile(path, fileName);

    // Insere o endereço da imagem no banco de dados
    await insertImage(savedFilePath, email);

    // Remove o arquivo temporário da pasta tmp
    fs.unlinkSync(path);

    res.status(200).json({ message: "success" });
  });
}
