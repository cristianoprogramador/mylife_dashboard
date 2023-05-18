import express from "express";
import multer from "multer";

import {
  createUser,
  createUserWithProvider,
  getUser,
  login,
} from "./controllers/userController";
import { getGoals, insertGoals } from "./controllers/goalsController";
import { getDiary, insertDiary } from "./controllers/diaryController";
import { getHistory, insertHistory } from "./controllers/historyController";

export const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now().toString() + "_" + file.originalname);
  },
});
const uploadPhoto = multer({ storage: storage });

router.post("/login", login);

router.get("/userData/:email", getUser);

router.post("/userCreate", createUserWithProvider);

router.post("/userCreateWithoutProvider", createUser);

router.get("/users_goals/:email/:year", getGoals);

router.post("/users_goals/:email/:year", insertGoals);

router.get("/users_diary/:email", getDiary);

router.post("/users_diary/:email", insertDiary);

router.get("/spending_history/:email", getHistory);

router.post("/spending_history/:email", insertHistory);
