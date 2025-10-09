const Submission = require("../models/submission");

const addSubmission = async (req, res) => {
  try {
    const { userId, quizId, answers, score, totalQuestions, timeSpent } = req.body;

    if (!userId || !quizId || !answers || !totalQuestions) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    // 🟢 Luôn lưu lại lần làm gần nhất
    const latestSubmission = await Submission.findOneAndUpdate(
      { userId, quizId, type: "latest" },
      { userId, quizId, answers, score, totalQuestions, timeSpent, type: "latest" },
      { upsert: true, new: true }
    );

    // 🟢 Cập nhật điểm cao nhất nếu cần
    const bestSubmission = await Submission.findOne({ userId, quizId, type: "best" });

    if (!bestSubmission || score > bestSubmission.score) {
      await Submission.findOneAndUpdate(
        { userId, quizId, type: "best" },
        { userId, quizId, answers, score, totalQuestions, timeSpent, type: "best" },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      message: "Đã lưu bài nộp thành công!",
      latestSubmission,
    });
  } catch (error) {
    console.error("❌ Lỗi khi lưu bài nộp:", error);
    res.status(500).json({ message: "Không thể lưu bài nộp." });
  }
};

// 🔹 Lấy tất cả bài nộp của người dùng (gồm best + latest)
const getUserSubmissions = async (req, res) => {
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

module.exports = {
  addSubmission,
  getUserSubmissions,
};
