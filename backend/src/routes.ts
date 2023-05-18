import express from "express";
import {
  createUser,
  createUserWithProvider,
  getUser,
  login,
} from "./controllers/userController";
import { getGoals, insertGoals } from "./controllers/goalsController";
import { getDiary, insertDiary } from "./controllers/diaryController";

export const router = express.Router();

router.post("/login", login);

router.post("/userData", getUser);

router.post("/userCreate", createUserWithProvider);

router.post("/userCreateWithoutProvider", createUser);

router.get("/users_goals/:email/:year", getGoals);

router.post("/users_goals/:email/:year", insertGoals);

router.get("/users_diary/:email", getDiary);

router.post("/users_diary/:email", insertDiary);
