import express from "express";
import {
  addChapter,
  getChapters,
  getChaptersFromSubject,
  updateChapterAvailability,
} from "../controllers/chapterController.js";

const router = express.Router();

router.get("/", getChapters);
router.get("/subject/:id", getChaptersFromSubject);
router.post("/", addChapter);
router.put("/:id", updateChapterAvailability);

export default router;
