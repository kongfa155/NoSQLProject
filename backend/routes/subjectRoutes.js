const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  getSubjects, addSubject
} = require("../controllers/subjectController");


//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getSubjects);
router.post("/", addSubject);

module.exports = router;
