//backend/src/controllers/userController.js
const User = require("../models/User");

// Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm user mới (Sử dụng pre-save hook trong models/User.js để tự động băm mật khẩu)
exports.createUser = async (req, res) => {
  try {
    const userData = { ...req.body };
    if (userData.active === undefined) userData.active = true; // ✅ Mặc định active

    const user = new User(userData);
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    res.status(400).json({ message: err.message });
  }
};

// Chuyển trạng thái hoạt động (active <-> inactive)
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.active = !user.active; // đảo giá trị true/false
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const bcrypt = require("bcryptjs");

exports.updateUser = async (req, res) => {
  try {
    const { username, email, password, role, active } = req.body;

    const updateData = { username, email, role, active };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
};
