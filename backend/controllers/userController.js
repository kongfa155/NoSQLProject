import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Lấy tất cả user
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Thêm user mới
export const createUser = async (req, res) => {
  try {
    const userData = { ...req.body };

    if (!userData.status) userData.status = "normal";

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

// Chuyển trạng thái banned <-> normal
export const toggleUserStatus = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json({
        message: "Không thể vô hiệu hóa chính tài khoản của bạn."
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "normal" ? "banned" : "normal";
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Cập nhật user
export const updateUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    if (req.user.id === targetId) {
      const { username } = req.body;
      return res.status(403).json({
        message: "Không thể thay đổi role, status hoặc email của chính bạn.",
      });
    }

    const { username, email, password, role, status } = req.body;

    const updateData = { username, email, role, status };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(targetId, updateData, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi cập nhật user" });
  }
};


// Xóa user hẳn nếu cần
export const deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(403).json({
        message: "Không thể xóa chính tài khoản của bạn.",
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

