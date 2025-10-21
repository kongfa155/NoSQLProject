import express from "express";
import {
  getQuiz,
  addQuiz,
  getQuizById,
  deleteQuiz,
  updateQuizAvailability,
  updateQuizFull,
  getQuizFromChapter,
  getQuizBySubject,
} from "../controllers/quizController.js";

const router = express.Router();

router.get("/", getQuiz);
router.post("/", addQuiz);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);
router.put("/:id/availability", updateQuizAvailability);
router.put("/:id/full", updateQuizFull);
router.get("/chapter/:id", getQuizFromChapter);
router.get("/subject/:subjectid", getQuizBySubject);

export default router;
