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
    //Nhận dữ liệu bài làm
    const { userId, quizId, answers, score, totalQuestions, timeSpent } =
      req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!userId || !quizId || !answers || !totalQuestions) {
      return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc." });
    }

    // Chuẩn hoá và validate score nếu có
    let scoreNum;
    if (typeof score !== "undefined" && score !== null) {
      scoreNum = Number(score);
      if (Number.isNaN(scoreNum) || scoreNum < 0) {
        // Trường hợp score không hợp lệ → không chấp nhận
        return res.status(400).json({ message: "Score không hợp lệ." });
      }
    }

    // Filter xác định submission của user trong quiz này
    const filter = {
      userId: new mongoose.Types.ObjectId(userId),
      quizId: new mongoose.Types.ObjectId(quizId),
    };

    // Kiểm tra user đã có submission chưa
    const existing = await Submission.findOne(filter);

    if (existing) {
      // Nếu User đã từng làm quiz → cập nhật bài nộp

      const update = {
        $set: {
          answers,
          totalQuestions,
          timeSpent,
          ...(typeof scoreNum !== "undefined" ? { score: scoreNum } : {}),
        },
      };

      // Sử dụng $max để đảm bảo bestScore chỉ tăng
      //Phải viết hàm set riêng thay vì set trong lúc so sánh max vì hàm sẽ chạy set trước khi chạy max
      if (typeof scoreNum !== "undefined") {
        update.$set.score = scoreNum; // score hiện tại
        update.$max = { bestScore: scoreNum }; // chỉ cập nhật nếu score cao hơn
      }
//Cập nhật lên db
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
      //Chưa có submission → tạo mới

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
    return res.status(500).json({ message: "Không thể lưu bài nộp." });
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
      .lean();

    res.status(200).json(bestSubmission || null);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy best submission", error: err.message });
  }
};
