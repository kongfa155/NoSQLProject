import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyAdmin, userController.createUser);
router.get("/", verifyAdmin, userController.getUsers);
router.patch("/:id/toggle", verifyAdmin, userController.toggleUserStatus);
router.delete("/:id", verifyAdmin, userController.deleteUser);
router.put("/:id", verifyAdmin, userController.updateUser);

export default router;
