const express = require("express");
const router = express.Router();
const {
  getUserSubmissions,
  addSubmission,
  getLatestSubmission,
} = require("../controllers/submissionController");

// Lấy tất cả bài nộp của user
router.get("/:userId", getUserSubmissions);

// Lấy bài làm gần nhất của user cho 1 quiz
router.get("/latest/:quizId/:userId", getLatestSubmission);

// Thêm hoặc cập nhật bài nộp
router.post("/", addSubmission);

module.exports = router;
