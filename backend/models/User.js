//backend/models/Users
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    active: { type: Boolean, default: true },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  {
    timestamps: true,
    collation: { locale: "en", strength: 2 },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
