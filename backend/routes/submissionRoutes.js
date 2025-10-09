const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getUserSubmissions, addSubmission
} = require("../controllers/submissionController");


//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getUserSubmissions);
router.post("/", addSubmission);

module.exports = router;
