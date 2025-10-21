import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", index: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
  explain: { type: String },
});

const QuestionText = mongoose.model("QuestionText", questionSchema);
export default QuestionText;
