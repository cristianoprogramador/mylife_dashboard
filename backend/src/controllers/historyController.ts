import { Request, Response } from "express";
import { getHistoryService, saveUserHistory } from "../services/historyService";

export const getHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.params;

  try {
    const diary = await getHistoryService(email);
    res.json(diary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const insertHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.params;
  const rowData = req.body; // Remove a desestruturação goalsString

  // console.log(rowData);

  try {
    const results = await saveUserHistory(email, rowData);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
