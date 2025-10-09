const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getQuestions,
  addQuestion,
  deleteQuestion,
  getQuestionsById,
} = require("../controllers/questionController.js");

//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getQuestions);
router.post("/", addQuestion);
router.delete("/:id", deleteQuestion);
router.get("/:id", getQuestionsById);
router.get("/quiz/:id", getQuestionsById);

module.exports = router;
