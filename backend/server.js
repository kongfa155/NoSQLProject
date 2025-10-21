import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import questionRoutes from "./routes/questionRoutes.js";
import questionImageRoutes from "./routes/questionImageRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import chapterRoutes from "./routes/chapterRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contributeRoutes from "./routes/contributeRoutes.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionRoutes);
app.use("/api/questionImages", questionImageRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contributed", contributeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
