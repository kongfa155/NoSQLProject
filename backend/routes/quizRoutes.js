const express = require("express");
const router = express.Router();
const {
  getQuiz,
  addQuiz,
  getQuizById,
  deleteQuiz,
  updateQuizAvailability,
  updateQuizFull,
  getQuizFromChapter,
  getQuizBySubject,
} = require("../controllers/quizController.js");

router.get("/", getQuiz);
router.post("/", addQuiz);
router.get("/:id", getQuizById);
router.delete("/:id", deleteQuiz);
router.put("/:id/availability", updateQuizAvailability);
router.put("/:id/full", updateQuizFull);
router.get("/chapter/:id", getQuizFromChapter);
router.get("/subject/:subjectid", getQuizBySubject);

module.exports = router;
