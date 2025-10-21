import express from "express";
import {
  getQuestions,
  addQuestion,
  deleteQuestion,
  getQuestionsById,
} from "../controllers/questionController.js";

const router = express.Router();

router.get("/", getQuestions);
router.post("/", addQuestion);
router.delete("/:id", deleteQuestion);
router.get("/:id", getQuestionsById);
router.get("/quiz/:id", getQuestionsById);

export default router;
