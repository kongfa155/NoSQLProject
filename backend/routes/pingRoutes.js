import express from "express";
import CronJobPing from "../controllers/pingController";
const router = express.Router();

router.get("/", CronJobPing);

export default router;
