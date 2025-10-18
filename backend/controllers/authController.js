//backend/src/controllers/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");


// -------------------------
// Xử lý đăng nhập
// -------------------------
exports.login = async (req, res) => { 
try {
const { username, email, password } = req.body;
const searchEmail = (email || '').toLowerCase().trim();
const searchUsername = (username || '').toLowerCase().trim();
    
if (!(searchEmail || searchUsername) || !password) {
return res.status(400).json({ message: "Vui lòng gửi email và mật khẩu" });
}

    // ✅ BƯỚC MỚI: Xây dựng mảng điều kiện $or động
    const orConditions = [];

    if (searchEmail) {
        // Tìm kiếm email không phân biệt chữ hoa/thường (i: case-insensitive)
        orConditions.push({ email: { $regex: new RegExp('^' + searchEmail + '$', 'i') } });
    }
    
    if (searchUsername) {
        orConditions.push({ username: { $regex: new RegExp('^' + searchUsername + '$', 'i') } });
    }

    // Đảm bảo có điều kiện tìm kiếm trước khi gọi findOne
    if (orConditions.length === 0) {
        return res.status(400).json({ message: "Vui lòng gửi email hoặc username" });
    }

// Tìm kiếm user bằng $or
const user = await User.findOne({ $or: orConditions });

if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Đăng nhập thành công",
      accessToken,
      refreshToken,
      role: user.role,
      email: user.email,
      name: user.username,
      id: user._id,
      active: user.active,
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi Server Nội bộ" });
  }
};
// -------------------------
// Làm mới token
// -------------------------
exports.refresh = (req, res) => { 
  const { refreshToken } = req.body; // LẤY TỪ REQUEST BODY
  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ message: "Invalid or expired refresh token" });

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  });
};

// -------------------------
// Kiểm tra token
// -------------------------
exports.checkToken = (req, res) => { // ✅ Export hàm checkToken
  res.status(200).json({
    message: "Token hợp lệ",
    user: req.user,
  });
};

