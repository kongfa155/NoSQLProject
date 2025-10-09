const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getQuiz,
  addQuiz,
  getQuizFromChapter,
  getQuizById,
  getQuizBySubject,
} = require("../controllers/quizController.js");

//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getQuiz);
router.get("/chapter/:id", getQuizFromChapter);
router.post("/", addQuiz);
router.get("/:id", getQuizById);
router.get("/subject/:subjectid", getQuizBySubject);
module.exports = router;
