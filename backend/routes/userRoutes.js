const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Lấy danh sách tất cả user
router.get("/", userController.getUsers);

// Tạo user mới
router.post("/", userController.createUser);

// Chuyển trạng thái active (true ↔ false)
router.patch("/:id/toggle", userController.toggleUserStatus);

// Xóa user
router.delete("/:id", userController.deleteUser);

module.exports = router;
