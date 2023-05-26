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
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  console.log(session.user);

  if (session.user?.email !== req.query.email) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    const email = req.query.email as string;
    const conn = await connection();

    try {
      const [rows] = await conn.execute<RowDataPacket[]>(
        "SELECT image, name FROM users WHERE email = ?",
        [email]
      );
      if (rows.length > 0) {
        res.json(rows[0]);
        return;
      }
      return null;
    } catch (error) {
      throw new Error(`Unable to fetch user: ${error}`);
    } finally {
      conn.end();
    }
  } else if (req.method === "PUT") {
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
