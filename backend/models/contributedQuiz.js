const mongoose = require("mongoose");

const contributedQuizSchema = new mongoose.Schema({
  contributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  questionNum: { type: Number },
  timeLimit: { type: Number },

  // 🔹 Trạng thái duyệt
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // 🔹 Ghi chú quản trị viên (lý do từ chối, feedback)
  adminNote: { type: String },

  // 🔹 Dữ liệu câu hỏi đóng góp
  questions: [
    {
      question: { type: String, required: true },
      image: { type: String },
      options: [{ type: String, required: true }],
      answer: { type: String, required: true },
      explain: { type: String },
    },
  ],

  // 🔹 Ghi nhận ai duyệt và khi nào
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },

  // 🔹 Tự động ghi ngày gửi
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContributedQuiz", contributedQuizSchema);
