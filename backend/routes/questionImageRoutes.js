const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getQuestionImages,
  addQuestionImage,
  deleteQuestionImage,
  getQuestionImagesById,
} = require("../controllers/questionImageController.js");


//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getQuestionImages);
router.post("/", addQuestionImage);
router.delete("/:id", deleteQuestionImage);
router.get("/:id", getQuestionImagesById);

module.exports = router;
