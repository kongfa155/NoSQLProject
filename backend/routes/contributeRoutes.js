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
} = require("../controllers/contributeController");

router.post("/uploadCSV", verifyToken, upload.single("file"), handleCSVUpload);
router.put("/approve/:id", verifyAdmin, approveContribution);
router.get("/", verifyAdmin, getAllContributedQuizzes);
router.get(
  "/paginated",
  verifyAdmin, // hoặc verifyToken nếu tất cả user cũng có quyền xem
  getContributedQuizzesPaginated
);
router.put("/reject/:id", verifyAdmin, rejectContribution);
router.get("/:id", verifyAdmin, getDetailContributedQuiz);

module.exports = router;
