const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getSubmissions, addSubmission
} = require("../controllers/submissionController");


//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getSubmissions);
router.post("/", addSubmission);

module.exports = router;
