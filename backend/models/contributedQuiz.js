const mongoose = require("mongoose");

const contributedQuizSchema = new mongoose.Schema({
  contributorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },

  // ✅ Cho phép null khi chọn "Khác"
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: false,
    default: null,
  },

  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
    default: null,
  },

  questionNum: { type: Number },
  timeLimit: { type: Number },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  adminNote: { type: String },

  questions: [
    {
      question: { type: String, required: true },
      image: { type: String },
      options: [{ type: String, required: true }],
      answer: { type: String, required: true },
      explain: { type: String },
    },
  ],

  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContributedQuiz", contributedQuizSchema);
