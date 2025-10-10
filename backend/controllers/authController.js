const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body; // username đang chứa email

      // Kiểm tra đầu vào an toàn
    if (!username || !password) {
        // Log lỗi cụ thể này
        console.error("Lỗi đăng nhập: Thiếu username hoặc password");
        return res.status(400).json({ message: "Vui lòng cung cấp đầy đủ email và mật khẩu." });
    }

    // 1. CHUẨN HÓA EMAIL TRƯỚC KHI TRUY VẤN
    const normalizedEmail = username.toLowerCase().trim();
    // 2. TÌM USER BẰNG EMAIL ĐÃ CHUẨN HÓA
    const user = await User.findOne({ email: normalizedEmail });
    
    // Lỗi: "Email không tồn tại" xảy ra ở đây
    if (!user) {
        return res.status(400).json({ message: "Email không tồn tại" });
    }

    // 3. SO SÁNH MẬT KHẨU (Yêu cầu mật khẩu trong DB phải được băm)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // 4. TẠO TOKEN
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. TRẢ VỀ KẾT QUẢ ĐĂNG NHẬP
    res.json({
      message: "Đăng nhập thành công",
      token,
      role: user.role,
      email: user.email, // <-- Gửi về email (đã có)
      name: user.name
    });
  } catch (err) {
    // Log lỗi chi tiết trên server
    console.error("Lỗi đăng nhập:", err.message);
    res.status(500).json({ message: "Lỗi Server Nội bộ" });
  }
};

module.exports = { loginUser };