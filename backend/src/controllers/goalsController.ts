import { Request, Response } from "express";
import { getGoalsService } from "../services/goalsService";

export const getGoals = async (req: Request, res: Response): Promise<void> => {
  const { email, year } = req.params;

  try {
    const user = await getGoalsService(email, year);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
