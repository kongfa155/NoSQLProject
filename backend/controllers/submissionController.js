// 📁 controllers/submissionController.js
import mongoose from "mongoose";
import Submission from "../models/submission.js";

// 🟢 Lưu hoặc cập nhật bài nộp
// controllers/submissionController.js
import mongoose from "mongoose";
import Submission from "../models/submission.js";

export const addSubmission = async (req, res) => {
  try {
    const { userId, quizId, answers, score, totalQuestions, timeSpent } =
      req.body;

    // basic required fields
    if (!userId || !quizId || !answers || !totalQuestions) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    // Normalize & validate score nếu có
    let scoreNum;
    if (typeof score !== "undefined" && score !== null) {
      scoreNum = Number(score);
      if (Number.isNaN(scoreNum) || scoreNum < 0) {
        // bạn có thể decide: reject request hoặc set về 0; ở đây reject request
        return res.status(400).json({ message: "Score không hợp lệ." });
      }
    }

    const filter = {
      userId: new mongoose.Types.ObjectId(userId),
      quizId: new mongoose.Types.ObjectId(quizId),
    };

    const existing = await Submission.findOne(filter);

    if (existing) {
      // Build update object: luôn cập nhật answers/totalQuestions/timeSpent
      const update = {
        $set: {
          answers,
          totalQuestions,
          timeSpent,
          // chỉ set score nếu score hợp lệ được gửi
          ...(typeof scoreNum !== "undefined" ? { score: scoreNum } : {}),
        },
      };

      // Sử dụng $max để đảm bảo bestScore chỉ tăng lên (không bị giảm)
      if (typeof scoreNum !== "undefined") {
        update.$max = { bestScore: scoreNum };
      }

      const updatedSubmission = await Submission.findOneAndUpdate(
        filter,
        update,
        { new: true }
      );

      return res.status(200).json({
        message: "Đã cập nhật bài nộp!",
        submission: updatedSubmission,
      });
    } else {
      // New submission: require scoreNum? ở đây nếu score không hợp lệ thì đã bị reject phía trên.
      const newSub = new Submission({
        userId,
        quizId,
        answers,
        score: typeof scoreNum !== "undefined" ? scoreNum : 0,
        bestScore: typeof scoreNum !== "undefined" ? scoreNum : 0,
        totalQuestions,
        timeSpent,
      });

      await newSub.save();

      return res.status(201).json({
        message: "Đã lưu bài nộp thành công!",
        submission: newSub,
      });
    }
  } catch (error) {
    console.error("❌ Lỗi khi lưu bài nộp:", error);
    return res.status(500).json({ message: "Không thể lưu bài nộp." });
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
    res.status(500).json({
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
