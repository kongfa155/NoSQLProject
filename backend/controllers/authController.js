//backend/controllers/authController
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { sendVerificationEmail } from "../api/sendEmail.js";

// -------------------------
// LOGIN
// -------------------------
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const searchEmail = (email || '').toLowerCase().trim();
    const searchUsername = (username || '').toLowerCase().trim();

    if (!(searchEmail || searchUsername) || !password) {
      return res.status(400).json({ message: "Vui lòng gửi email và mật khẩu" });
    }

    const orConditions = [];
    if (searchEmail) {
      orConditions.push({ email: { $regex: new RegExp("^" + searchEmail + "$", "i") } });
    }
    if (searchUsername) {
      orConditions.push({ username: { $regex: new RegExp("^" + searchUsername + "$", "i") } });
      orConditions.push({ email: { $regex: new RegExp("^" + searchUsername + "$", "i") } });
    }

    const user = await User.findOne({ $or: orConditions });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    if (!user.active) {
      return res.status(400).json({ message: "Tài khoản chưa xác thực email" });
    }

        if (user.status === "banned") {
      return res.status(403).json({
          message: "Tài khoản đã bị khóa",
          status: "banned"
        });
      }

    // Check password
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

    return res.status(200).json({
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
// REFRESH TOKEN
// -------------------------
export const refresh = (req, res) => {
  const { refreshToken } = req.body;
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
// CHECK TOKEN
// -------------------------
export const checkToken = (req, res) => {
  res.status(200).json({
    message: "Token hợp lệ",
    user: req.user,
  });
};


// -------------------------
// REGISTER + SEND OTP
// -------------------------
export const register = async (req, res) => {
  console.log("🚀 [REGISTER] Request body:", req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.active) {
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // gửi lại OTP
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpiry;
      await existingUser.save();
      await sendVerificationEmail(email, otp);

      return res.status(200).json({
        message: "Email chưa xác thực. Mã OTP mới đã được gửi.",
        email,
      });
    }


    const newUser = new User({
      email,
      username: email,
      password: password,
      role: "User",
      active: false, 
      status: "normal",
      otp,
      otpExpires: otpExpiry,
    });

    await newUser.save();

    await sendVerificationEmail(email, otp);

    res.status(200).json({
      message: "Đã gửi mã OTP xác thực tới email của bạn.",
      email,
    });

  } catch (error) {
    console.error("❌ [REGISTER] Lỗi:", error);
    res.status(500).json({ message: "Lỗi đăng ký", error });
  }
};


// -------------------------
// VERIFY OTP
// -------------------------
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Không tìm thấy tài khoản" });

    if (user.active) return res.status(400).json({ message: "Tài khoản đã được kích hoạt" });
    if (user.otp !== otp) return res.status(400).json({ message: "Mã OTP không đúng" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "Mã OTP đã hết hạn" });

    user.otp = null;
    user.otpExpires = null;
    user.active = true;

    await user.save();

    res.status(200).json({ message: "Xác thực thành công! Tài khoản đã được kích hoạt." });

  } catch (error) {
    console.error("Lỗi xác thực OTP:", error);
    res.status(500).json({ message: "Lỗi xác thực OTP", error });
  }
};


// -------------------------
// FORGOT PASSWORD
// -------------------------
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpiry;
    await user.save();

    await sendVerificationEmail(email, otp);

    res.status(200).json({ message: "Mã OTP đã được gửi đến email của bạn." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// -------------------------
// VERIFY FORGOT-PASSWORD OTP
// -------------------------
export const verifyForgotOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    if (user.otp !== otp) return res.status(400).json({ message: "OTP không đúng" });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP đã hết hạn" });

    res.status(200).json({ message: "OTP hợp lệ, bạn có thể đặt lại mật khẩu" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// -------------------------
// RESET PASSWORD
// -------------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        message: "Mật khẩu mới không được để trống"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email không tồn tại"
      });
    }

    if (user.status === "banned") {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa",
        status: "banned"
      });
    }

    if (!user.active) {
      return res.status(400).json({
        message: "Tài khoản chưa xác thực email"
      });
    }

     if (!user.otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;        
    user.otpExpires = null; 
    await user.save();

    return res.status(200).json({
      message: "Mật khẩu đã được cập nhật thành công."
    });

  } catch (err) {
    console.error("❌ resetPassword error:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

