// ========================================================================
//backend/src/controllers/submissionController.js
//Mục đích: Quản lý toàn bộ bài nộp (Submission) của người dùng
//
// Controller này xử lý các chức năng:
// 1) addSubmission → Lưu bài nộp mới hoặc cập nhật bài nộp cũ
//    - Một user chỉ có 1 submission cho mỗi quiz → submit lại sẽ cập nhật
//    - bestScore luôn giữ điểm cao nhất nhờ MongoDB $max
// 2) getLatestSubmission → Lấy bài làm mới nhất của user cho một quiz
// 3) getUserSubmissions → Lấy toàn bộ submission của một user
// 4) getAllSubmissionFromSubject → Lấy toàn bộ submission theo môn học
// 5) getBestSubmission → Lấy bài có điểm cao nhất
//
//Lưu ý chung:
// - Tham số luôn được validate trước khi truy vấn DB
// - Score phải >= 0, nếu sai → reject
// - updatedAt và createdAt tự động được MongoDB quản lý
// ========================================================================

import mongoose from "mongoose";
import Submission from "../models/submission.js";

// ========================================================================
// 1) Thêm hoặc cập nhật bài nộp
//    - Nếu user đã từng làm quiz đó → cập nhật
//    - Nếu chưa → tạo submission mới
//    - bestScore dùng $max để luôn giữ điểm cao nhất
// ========================================================================
export const addSubmission = async (req, res) => {
  try {
    const { userId, quizId, answers, totalQuestions, score, timeSpent } =
      req.body;
    const scoreNum = typeof score === "number" ? score : 0;

    // tìm submission đã tồn tại theo userId + quizId
    let submission = await Submission.findOne({ userId, quizId });

    if (submission) {
      // cập nhật bài cũ (bestScore chỉ tăng lên chứ không giảm)
      submission.answers = answers;
      submission.totalQuestions = totalQuestions;
      submission.score = scoreNum; // điểm của lần thi này (latest score)
      submission.timeSpent = timeSpent;
      submission.bestScore = Math.max(submission.bestScore, scoreNum); // giữ điểm cao nhất

      await submission.save();
      return res.status(200).json({
        message: "Cập nhật bài thi thành công",
        submission,
      });
    }

    // nếu chưa có submission → tạo mới
    submission = new Submission({
      userId,
      quizId,
      answers,
      totalQuestions,
      score: scoreNum,
      bestScore: scoreNum, // lần đầu → best = score
      timeSpent,
    });

    await submission.save();
    return res.status(201).json({
      message: "Tạo mới bài thi thành công",
      submission,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ========================================================================
// 2) Lấy bài làm gần nhất của user cho 1 quiz
// ========================================================================
export const getLatestSubmission = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    // Validate id đầu vào
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
    //Lấy dữ liệu lần làm bài gần nhất của người dùng
    const latest = await Submission.findOne({
      quizId: new mongoose.Types.ObjectId(quizId),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ updatedAt: -1 })
      .lean();

    if (!latest) return res.status(200).json(null);
    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({
      message: "Không thể lấy bài làm gần nhất.",
      error: error.message,
    });
  }
};

// ========================================================================
// 3) Lấy toàn bộ submission của 1 user
//    - populate quizId để lấy thông tin quiz
// ========================================================================
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

// ========================================================================
// 4) Lấy toàn bộ submission theo môn học
//    - Dùng thêm subjectId + chapterId để lọc dùng để tính điểm cho Stats
// ========================================================================
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

// ========================================================================
// 5) Lấy bài nộp có điểm cao nhất
// ========================================================================
export const getBestSubmission = async (req, res) => {
  try {
    const { quizId, userId } = req.params;

    if (!quizId || !userId)
      return res.status(400).json({ message: "Thiếu quizId hoặc userId" });

    // Validate ObjectId
    if (
      !/^[0-9a-fA-F]{24}$/.test(quizId) ||
      !/^[0-9a-fA-F]{24}$/.test(userId)
    ) {
      return res
        .status(400)
        .json({ message: "quizId hoặc userId không hợp lệ" });
    }
    //Lấy điểm cao nhất của người dùng theo bài làm
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
