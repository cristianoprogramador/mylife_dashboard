import { Request, Response } from "express";
import { getDiaryService, saveUserDiary } from "../services/diaryService";

export const getDiary = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.params;

  try {
    const diary = await getDiaryService(email);
    res.json(diary);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const insertDiary = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.params;
  const diaryEntries = req.body; // Remove a desestruturação goalsString

  // console.log(diary);

  try {
    const results = await saveUserDiary(email, diaryEntries);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
