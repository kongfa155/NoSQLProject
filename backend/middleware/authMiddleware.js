const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware xác thực token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token, vui lòng đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

// Middleware xác thực quyền admin
const verifyAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.role === "Admin") {
      next();
    } else {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

module.exports = { verifyToken, verifyAdmin };
