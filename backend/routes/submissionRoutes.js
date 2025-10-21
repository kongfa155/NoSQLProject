import express from "express";
import {
  getUserSubmissions,
  addSubmission,
  getLatestSubmission,
  getAllSubmissionFromSubject,
  getBestSubmission,
} from "../controllers/submissionController.js";

const router = express.Router();

router.get("/:userId", getUserSubmissions);
router.get("/latest/:quizId/:userId", getLatestSubmission);
router.get("/subject/:userId/:subjectId", getAllSubmissionFromSubject);
router.get("/best/:quizId/:userId", getBestSubmission);
router.post("/", addSubmission);

export default router;
