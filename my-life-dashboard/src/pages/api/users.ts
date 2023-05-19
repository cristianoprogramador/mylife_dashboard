import { NextApiRequest, NextApiResponse } from "next";
import connection from "./db";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

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
  } else {
    res.status(404).json({ message: "Rota não encontrada" });
  }
}
