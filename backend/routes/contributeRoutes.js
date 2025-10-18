const express = require("express");
const router = express.Router();
const upload = require("../middlewares/uploadMiddleware");
const { verifyToken, verifyAdmin } = require("../middlewares/verifyToken");
const {
  handleCSVUpload,
  approveContribution,
  getAllContributedQuizzes,
  rejectContribution,
  getDetailContributedQuiz,
  getContributedQuizzesPaginated,
  getContributionStats,
} = require("../controllers/contributeController");

router.post("/uploadCSV", verifyToken, upload.single("file"), handleCSVUpload);
router.put("/approve/:id", verifyAdmin, approveContribution);
router.get("/", verifyAdmin, getAllContributedQuizzes);
router.get("/paginated", verifyAdmin, getContributedQuizzesPaginated);
router.get("/stats", verifyToken, getContributionStats);

router.put("/reject/:id", verifyAdmin, rejectContribution);
router.get("/:id", verifyAdmin, getDetailContributedQuiz);

module.exports = router;
