
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, verifyAdmin } = require("../middlewares/verifyToken");

// Chỉ admin mới có thể tạo user
router.post("/", verifyAdmin, userController.createUser);

// Các route khác vẫn bình thường
router.get("/", verifyAdmin, userController.getUsers);
router.patch("/:id/toggle", verifyAdmin, userController.toggleUserStatus);
router.delete("/:id", verifyAdmin, userController.deleteUser);
router.put("/:id", verifyAdmin, userController.updateUser);

module.exports = router;
