// 📁 controllers/submissionController.js
import mongoose from "mongoose";
import Submission from "../models/submission.js";

// 🟢 Lưu hoặc cập nhật bài nộp
export const addSubmission = async (req, res) => {
  try {
    const { userId, quizId, answers, score, totalQuestions, timeSpent } =
      req.body;

    if (!userId || !quizId || !answers || !totalQuestions) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    const existing = await Submission.findOne({ userId, quizId });

    let updatedSubmission;
    if (existing) {
      updatedSubmission = await Submission.findOneAndUpdate(
        { userId, quizId },
        {
          answers,
          totalQuestions,
          timeSpent,
          score,
          bestScore: Math.max(existing.bestScore || existing.score || 0, score),
        },
        { new: true }
      );
    } else {
      updatedSubmission = new Submission({
        userId,
        quizId,
        answers,
        score,
        bestScore: score,
        totalQuestions,
        timeSpent,
      });
      await updatedSubmission.save();
    }

    res.status(201).json({
      message: "Đã lưu bài nộp thành công!",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lưu bài nộp:", error);
    res.status(500).json({ message: "Không thể lưu bài nộp." });
  }
};

// 🟢 Lấy bài làm gần nhất
export const getLatestSubmission = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId || !userId) {
      return res.status(400).json({ message: "Thiếu quizId hoặc userId." });
    }
    if (
      !/^[0-9a-fA-F]{24}$/.test(quizId) ||
      !/^[0-9a-fA-F]{24}$/.test(userId)
    ) {
      return res
        .status(400)
        .json({ message: "quizId hoặc userId không hợp lệ." });
    }

    const latest = await Submission.findOne({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (!latest) return res.status(200).json(null);
    res.status(200).json(latest);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài làm gần nhất:", error);
    res
      .status(500)
      .json({
        message: "Không thể lấy bài làm gần nhất.",
        error: error.message,
      });
  }
};

// 🟢 Lấy toàn bộ submission của user
export const getUserSubmissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const submissions = await Submission.find({ userId })
      .populate("quizId")
      .sort({ updatedAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    console.error("❌ Lỗi khi lấy bài nộp:", error);
    res.status(500).json({ message: "Không thể lấy bài nộp của người dùng." });
  }
};

// 🟢 Lấy tất cả submission theo môn học
export const getAllSubmissionFromSubject = async (req, res) => {
  const { userId, subjectId } = req.params;

  try {
    const submissions = await Submission.find({ userId, subjectId })
      .populate("quizId")
      .populate("chapterId");

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy submissions theo môn" });
  }
};

// 🟢 Lấy best submission
export const getBestSubmission = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId || !userId)
      return res.status(400).json({ message: "Thiếu quizId hoặc userId" });

    if (
      !/^[0-9a-fA-F]{24}$/.test(quizId) ||
      !/^[0-9a-fA-F]{24}$/.test(userId)
    ) {
      return res
        .status(400)
        .json({ message: "quizId hoặc userId không hợp lệ" });
    }

    const bestSubmission = await Submission.findOne({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ bestScore: -1 })
      .lean();

    res.status(200).json(bestSubmission || null);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy best submission", error: err.message });
  }
};
