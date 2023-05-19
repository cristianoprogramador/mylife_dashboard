import { Request, Response } from "express";
import {
  createUserProvider,
  createUserWithoutProvider,
  getUserByEmail,
  loginUser,
  updateUserAvatar,
  updateUserName,
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
  const { email } = req.params;

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

export const updateProfileName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.body;
  const { email } = req.params;

  try {
    const result = await updateUserName(name, email);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProfileAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  let json = { error: "", result: {} };
  let photoUrl = null;

  const { email } = req.params;

  if (req.file) {
    photoUrl = `/images/${req.file.filename}`;
    console.log("NOME DA FOTO", photoUrl);
  }

  try {
    const result = await updateUserAvatar(photoUrl, email);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
