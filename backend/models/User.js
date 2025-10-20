//backend/src/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["User", "Admin"], // ✅ Cho phép cả User lẫn Admin
    default: "User",
  },
  active: {
    type: Boolean,
    default: true,
  },
    otp: { type: String },
    otpExpires: { type: Date },
}, { timestamps: true });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
},  { 
    timestamps: true, 
    // ✅ THÊM DÒNG NÀY ĐỂ GIẢI QUYẾT TRIỆT ĐỂ LỖI FINDONE()
    collation: { locale: 'en', strength: 2 } // strength: 2 là non-case sensitive
}
);
module.exports = mongoose.model("User", userSchema);
