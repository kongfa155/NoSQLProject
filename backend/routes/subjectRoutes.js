import express from "express";
import {
  getSubjects,
  addSubject,
  getSubjectById,
  deleteSubject,
  updateSubjectAvailability,
} from "../controllers/subjectController.js";

const router = express.Router();

router.get("/", getSubjects);
router.get("/:id", getSubjectById);
router.post("/", addSubject);
router.delete("/:id", deleteSubject);
router.put("/:id",updateSubjectAvailability)

export default router;
