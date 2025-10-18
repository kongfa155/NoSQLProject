// controllers/contributeController.js
const Quiz = require("../models/quiz");
const QuestionText = require("../models/questionText");
const QuestionImage = require("../models/questionImage");
const ContributedQuiz = require("../models/contributedQuiz");
const Subject = require("../models/subject");
const Chapter = require("../models/chapter");
const fs = require("fs");
const csv = require("csv-parser");

const approveContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contrib = await ContributedQuiz.findById(id);
    if (!contrib)
      return res.status(404).json({ message: "Không tìm thấy đóng góp" });

    let subject = null;
    if (contrib.subjectId) {
      subject = await Subject.findById(contrib.subjectId);
      if (!subject)
        return res.status(400).json({ message: "Môn học không hợp lệ" });
    }

    let chapter = null;
    if (contrib.chapterId) {
      chapter = await Chapter.findById(contrib.chapterId);
      if (!chapter)
        return res.status(400).json({ message: "Chương không hợp lệ" });
    }

    // 1. Tạo Quiz mới
    const quiz = await Quiz.create({
      name: contrib.name,
      subjectId: contrib.subjectId || null,
      chapterId: contrib.chapterId || null,
      questionNum: contrib.questions.length,
      timeLimit: contrib.timeLimit || 0,
      availability: true,
    });

    // 2. Tạo câu hỏi text & image
    const questionsText = contrib.questions
      .filter((q) => !q.image)
      .map((q) => ({
        quizId: quiz._id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain || "",
      }));
    if (questionsText.length > 0) await QuestionText.insertMany(questionsText);

    const questionsImage = contrib.questions
      .filter((q) => q.image)
      .map((q) => ({
        quizId: quiz._id,
        question: q.question,
        image: q.image,
        options: q.options,
        answer: q.answer,
        explain: q.explain || "",
      }));
    if (questionsImage.length > 0)
      await QuestionImage.insertMany(questionsImage);

    // Cập nhật trạng thái contributed
    contrib.status = "approved";
    contrib.approvedAt = new Date();
    contrib.approvedBy = req.user?._id || null;
    await contrib.save();

    res.json({
      message: "✅ Đã duyệt và tạo quiz thành công!",
      quizId: quiz._id,
    });
  } catch (err) {
    console.error("Lỗi duyệt đóng góp:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAllContributedQuizzes = async (req, res) => {
  try {
    const quizzes = await ContributedQuiz.find()
      .populate("contributorId", "username email")
      .populate("subjectId", "name")
      .populate("chapterId", "name")
      .sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đề đóng góp" });
  }
};
const handleCSVUpload = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Chưa tải lên file CSV nào!" });

    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => results.push(row))
      .on("end", async () => {
        try {
          const questions = results.map((r) => ({
            question: r.question,
            options: [r.option1, r.option2, r.option3, r.option4],
            answer: r.answer,
            explain: r.explain || "",
          }));

          // Map subjectId/chapterId: nếu client gửi "" => để null
          const subjectId =
            req.body.subjectId && req.body.subjectId !== ""
              ? req.body.subjectId
              : null;
          const chapterId =
            req.body.chapterId && req.body.chapterId !== ""
              ? req.body.chapterId
              : null;

          await ContributedQuiz.create({
            contributorId: req.user.id, // Lấy từ token middleware
            name: req.body.name || "Đề đóng góp từ CSV",
            subjectId: subjectId, // có thể là null
            chapterId: chapterId, // có thể là null
            questionNum: questions.length,
            timeLimit: req.body.timeLimit || 45,
            questions,
          });

          fs.unlinkSync(filePath);
          res.json({ message: "✅ Tải lên và lưu đề đóng góp thành công!" });
        } catch (err) {
          console.error("Lỗi khi lưu đề:", err);
          res.status(500).json({ message: "Lỗi khi lưu đề đóng góp!" });
        }
      });
  } catch (err) {
    console.error("Lỗi CSV Upload:", err);
    res.status(500).json({ message: err.message });
  }
};

const rejectContribution = async (req, res) => {
  try {
    const { id } = req.params;
    const contrib = await ContributedQuiz.findById(id);
    if (!contrib) {
      return res.status(404).json({ message: "Không tìm thấy đóng góp" });
    }

    contrib.status = "rejected";
    contrib.rejectedAt = new Date();
    contrib.rejectedBy = req.user?._id || null;
    await contrib.save();

    res.json({ message: `❌ Đã từ chối đề "${contrib.name}".` });
  } catch (err) {
    console.error("Lỗi khi từ chối đề:", err);
    res.status(500).json({ message: "Lỗi khi từ chối đề đóng góp!" });
  }
};

const getDetailContributedQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const contrib = await ContributedQuiz.findById(id)
      .populate("contributorId", "username email")
      .populate("subjectId", "name")
      .populate("chapterId", "name");

    if (!contrib) {
      return res.status(404).json({ message: "Không tìm thấy đề đóng góp." });
    }

    res.json(contrib);
  } catch (err) {
    console.error("❌ Lỗi khi lấy đề đóng góp:", err);
    res.status(500).json({ message: "Lỗi khi lấy đề đóng góp." });
  }
};

const getContributedQuizzesPaginated = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const total = await ContributedQuiz.countDocuments();

    // ⚡ Sử dụng aggregation pipeline để sort theo thứ tự tùy ý
    const quizzes = await ContributedQuiz.aggregate([
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "approved"] }, then: 2 },
                { case: { $eq: ["$status", "rejected"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { statusOrder: 1, createdAt: -1 } }, // pending → approved → rejected
      { $skip: skip },
      { $limit: limit },
    ]);

    // ⚠️ populate thủ công vì aggregation không tự populate
    await ContributedQuiz.populate(quizzes, [
      { path: "contributorId", select: "username email" },
      { path: "subjectId", select: "name" },
      { path: "chapterId", select: "name" },
    ]);

    res.json({
      data: quizzes,
      total,
      pageCount: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error("❌ Lỗi khi phân trang đề đóng góp:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách đóng góp có phân trang." });
  }
};

module.exports = {
  handleCSVUpload,
  approveContribution,
  getAllContributedQuizzes,
  rejectContribution,
  getDetailContributedQuiz,
  getContributedQuizzesPaginated,
};
