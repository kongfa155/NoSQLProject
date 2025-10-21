import express from "express";
import * as authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", verifyToken, authController.checkToken);
router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOTP);

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotOtp);
router.post("/reset-password", authController.resetPassword);

export default router;
