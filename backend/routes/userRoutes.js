//backend/src/routes/UserRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");


router.get("/", userController.getUsers);
router.post("/",  userController.createUser);
router.patch("/:id/toggle", userController.toggleUserStatus);
router.delete("/:id",  userController.deleteUser);

module.exports = router;
