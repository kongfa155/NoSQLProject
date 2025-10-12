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

    answers: [
      {
        questionId: { type: String, required: true },
        selectedOption: { type: String, required: true },
        isCorrect: { type: Boolean, required: true },
      },
    ],

    score: { type: Number, required: true },
    bestScore: { type: Number, default: 0 }, // ✅ thêm field điểm cao nhất
    totalQuestions: { type: Number, required: true },
    timeSpent: { type: Number, default: 0 }, // giây
  },
  { timestamps: true }
);

module.exports = mongoose.model("Submission", submissionSchema);
