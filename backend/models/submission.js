const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    // Lưu mảng câu trả lời (để review chi tiết)
    answers: [
      {
        questionId: { type: String, required: true },
        selectedOption: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],

    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 }, // giây

    // Loại bài nộp (best hoặc latest)
    type: {
      type: String,
      enum: ["latest", "best"],
      default: "latest",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
