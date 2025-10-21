import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";
import {
  handleCSVUpload,
  approveContribution,
  getAllContributedQuizzes,
  rejectContribution,
  getDetailContributedQuiz,
  getContributedQuizzesPaginated,
  getContributionStats,
} from "../controllers/contributeController.js";

const router = express.Router();

router.post("/uploadCSV", verifyToken, upload.single("file"), handleCSVUpload);
router.put("/approve/:id", verifyAdmin, approveContribution);
router.get("/", verifyAdmin, getAllContributedQuizzes);
router.get("/paginated", verifyAdmin, getContributedQuizzesPaginated);
router.get("/stats", verifyToken, getContributionStats);
router.put("/reject/:id", verifyAdmin, rejectContribution);
router.get("/:id", verifyAdmin, getDetailContributedQuiz);

export default router;
