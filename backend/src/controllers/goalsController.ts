import { Request, Response } from "express";
import { getGoalsService, saveUserGoals } from "../services/goalsService";

export const getGoals = async (req: Request, res: Response): Promise<void> => {
  const { email, year } = req.params;

  try {
    const goals = await getGoalsService(email, year);
    res.json(goals);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const insertGoals = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, year } = req.params;
  const goals = req.body; // Remove a desestruturação goalsString

  // console.log(goals);

  try {
    const results = await saveUserGoals(email, year, goals);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
