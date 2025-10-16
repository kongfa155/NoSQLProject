const express = require("express");
const router = express.Router();
const {
  getUserSubmissions,
  addSubmission,
  getLatestSubmission,
  getAllSubmissionFromSubject,
  getBestSubmission,
} = require("../controllers/submissionController");

// Lấy tất cả bài nộp của user
router.get("/:userId", getUserSubmissions);

// Lấy bài làm gần nhất của user cho 1 quiz
router.get("/latest/:quizId/:userId", getLatestSubmission);
// Lấy tất cả submissions của user trong 1 môn
router.get("/subject/:userId/:subjectId", getAllSubmissionFromSubject);
router.get("/best/:quizId/:userId", getBestSubmission);
// Thêm hoặc cập nhật bài nộp
router.post("/", addSubmission);

module.exports = router;
