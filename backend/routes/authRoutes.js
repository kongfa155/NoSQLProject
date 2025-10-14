// backend/src/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/verifyToken"); // Chỉ cần verifyToken

router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/me", verifyToken, authController.checkToken);

module.exports = router;