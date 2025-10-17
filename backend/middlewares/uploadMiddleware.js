// backend/middlewares/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🔹 Tạo thư mục lưu file tạm (nếu chưa tồn tại)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔹 Cấu hình nơi lưu file CSV tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 🔹 Kiểm tra định dạng file (chỉ chấp nhận .csv)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".csv") {
    return cb(new Error("Chỉ được tải lên file CSV!"));
  }
  cb(null, true);
};

// 🔹 Khởi tạo multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn 5MB
  },
});

module.exports = upload;
