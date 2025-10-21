// backend/src/middlewares/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// 🔹 Tạo thư mục lưu file tạm nếu chưa có
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 🔹 Cấu hình lưu file CSV tạm
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// 🔹 Kiểm tra định dạng file
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
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
});

export default upload;
