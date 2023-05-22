import { NextApiRequest, NextApiResponse } from "next";
import connection from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { email, password } = req.body;
    const conn = await connection();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await conn.execute("UPDATE users SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      throw new Error(`Unable to update password: ${error}`);
    } finally {
      conn.end();
    }
  } else {
    res.status(404).json({ message: "Rota não encontrada" });
  }
}
