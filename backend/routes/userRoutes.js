//backend/src/routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyAdmin } = require("../middlewares/verifyToken"); // 👈 Chuẩn với export ở trên

router.get("/", userController.getUsers);
router.post("/", verifyAdmin, userController.createUser);
router.patch("/:id/toggle", verifyAdmin, userController.toggleUserStatus);
router.delete("/:id", verifyAdmin, userController.deleteUser);

module.exports = router;
