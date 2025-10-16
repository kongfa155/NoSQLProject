//backend/src/middlewares/verifyToken.js

const jwt = require("jsonwebtoken");

// ✅ Kiểm tra token hợp lệ
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Không có token hoặc token không hợp lệ" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// ✅ Kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      next();
    } else {
      return res.status(403).json({ message: "Không có quyền truy cập (chỉ Admin)" });
    }
  });
};

// ✅ Export chuẩn (2 hàm)
module.exports = { verifyToken, verifyAdmin };
