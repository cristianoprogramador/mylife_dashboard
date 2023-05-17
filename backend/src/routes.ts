import express from "express";
import {
  createUser,
  createUserWithProvider,
  getUser,
  login,
} from "./controllers/userController";
import { getGoals } from "./controllers/goalsController";

export const router = express.Router();

router.post("/login", login);

router.post("/userData", getUser);

router.post("/userCreate", createUserWithProvider);

router.post("/userCreateWithoutProvider", createUser);

router.get("/users_goals/:email/:year", getGoals);
