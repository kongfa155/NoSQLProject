const User = require("../models/User");

// Lấy tất cả user
exports.getUsers = async (req, res) => {
  try {
    // Không trả về password trong danh sách user
    const users = await User.find().select('-password'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm user mới (Sử dụng pre-save hook trong models/User.js để tự động băm mật khẩu)
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    // Mongoose hook sẽ tự động băm mật khẩu trước khi save
    await user.save(); 
    // Trả về user mà không bao gồm password
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    // Đảm bảo thông báo lỗi thân thiện hơn
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