import express from "express";
import {
  getQuestionImages,
  addQuestionImage,
  deleteQuestionImage,
  getQuestionImagesById,
} from "../controllers/questionImageController.js";

const router = express.Router();

router.get("/", getQuestionImages);
router.post("/", addQuestionImage);
router.delete("/:id", deleteQuestionImage);
router.get("/:id", getQuestionImagesById);

export default router;
