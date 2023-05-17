import { Request, Response } from "express";
import {
  createUserProvider,
  createUserWithoutProvider,
  getUserByEmail,
  loginUser,
} from "../services/userService";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await getUserByEmail(email);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUserWithProvider = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password, image } = req.body;

  try {
    const result = await createUserProvider(name, email, password, image);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const result = await createUserWithoutProvider(name, email, password);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
