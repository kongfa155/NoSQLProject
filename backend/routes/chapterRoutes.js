const express = require("express");
const router = express.Router();
//Các hàm gọi của router (Không cần thiết phải hiểu)

//Nhận các hàm từ controller
const {
  addChapter, getChapters, getChaptersFromSubject,
  updateChapterAvailability
} = require("../controllers/chapterController");


//Gọi các hàm theo nhánh ví dụ question/ mà phương thức get sẽ gọi hàm 1,...
router.get("/", getChapters);
router.get("/subject/:id", getChaptersFromSubject);
router.post("/", addChapter);
router.put("/:id", updateChapterAvailability);

module.exports = router;
