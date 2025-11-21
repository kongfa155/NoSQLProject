// backend/src/middlewares/uploadMiddleware.js

/**
 * Middleware upload CSV dùng Multer
 * ----------------------------------
 * Lưu file tạm vào thư mục /uploads
 * Tự tạo thư mục nếu chưa có
 * Chỉ cho phép upload file .csv
 * Giới hạn kích thước tối đa 5MB
 */

import multer from "multer";
import path from "path";
import fs from "fs";

// Đường dẫn thư mục lưu file tạm
const uploadDir = path.join(process.cwd(), "uploads");

//Tự động tạo thư mục nếu chưa tồn tại (tránh lỗi Multer ENOENT)
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * Cấu hình nơi lưu file & tên file
 * Multer sẽ lưu file vào thư mục uploads/
 * và đặt tên theo timestamp để tránh trùng lặp.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Lưu vào thư mục uploads/
  },
  filename: (req, file, cb) => {
    // Tạo tên file duy nhất: timestamp-originalName.csv
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

/**
 * Bộ lọc file (chỉ cho phép CSV)
 * Nếu file không phải .csv → báo lỗi và không upload.
 */
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext !== ".csv") {
    return cb(new Error("Chỉ được tải lên file CSV!"));
  }

  cb(null, true); // Hợp lệ
};

/**
 * Khởi tạo Multer với cấu hình:
 * - Storage: lưu file tạm
 * - FileFilter: kiểm tra đuôi file
 * - Limits: giới hạn 5MB để tránh upload file quá lớn
 */
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
