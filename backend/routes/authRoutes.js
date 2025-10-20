// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken"); // Chỉ cần verifyToken

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", verifyToken, authController.checkToken);
router.post("/register", authController.register); 
router.post("/verify-otp", authController.verifyOTP); 

router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-forgot-otp", authController.verifyForgotOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;