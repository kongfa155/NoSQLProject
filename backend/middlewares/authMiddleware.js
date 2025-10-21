// backend/src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import express from "express";

const app = express();
app.use(express.json());

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Không có token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token không hợp lệ" });
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "Admin") {
      next();
    } else {
      res.status(403).json({ message: "Không có quyền Admin" });
    }
  });
};
