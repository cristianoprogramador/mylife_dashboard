import { NextApiRequest, NextApiResponse } from "next";

export default function ErrorPage(req: NextApiRequest, res: NextApiResponse) {
  const { error } = req.query;
  res.status(400).json({ error });
}
