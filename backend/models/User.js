const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "User"
  },
  avatar: {
    type: String, // URL của ảnh đại diện
    default: ""
  },
  active: {
    type: Boolean, // true: hoạt động, false: bị khóa
    default: true
  }
}, {
  timestamps: true // tự động thêm createdAt và updatedAt
});

// MIDDLEWARE: Băm mật khẩu trước khi lưu
userSchema.pre("save", async function(next) {
    // Chỉ băm nếu trường 'password' bị thay đổi (khi tạo mới hoặc cập nhật)
    if (!this.isModified("password")) {
        return next();
    }
    try {
        // Băm mật khẩu
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model("User", userSchema);