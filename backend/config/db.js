// 📁 config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // nạp biến môi trường từ .env

// 🟢 Hàm kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Dừng chương trình nếu không kết nối được
  }
};

export default connectDB;
