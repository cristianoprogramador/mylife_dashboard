import { NextApiRequest, NextApiResponse } from "next";
import { createUser } from "./usersCreate";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  try {
    const result = await createUser(name, email, password);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    return res.status(200).json({ userId: result.userId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
