const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ===== Đăng ký tài khoản (dành cho testing) =====
exports.register = async (req, res) => {
  try {
    const { IDUser, name, email, password, role } = req.body;

    // Mã hoá mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      IDUser,
      name,
      email,
      password: hashedPassword,
      role: role || "User",
    });

    await user.save();
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== Đăng nhập =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // Tạo token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== Lấy danh sách user =====
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== Cập nhật user =====
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    if (update.password)
      update.password = await bcrypt.hash(update.password, 10);

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===== Xóa user =====
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
