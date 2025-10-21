import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  name: { type: String },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" },
  questionNum: { type: Number },
  timeLimit: { type: Number },
  availability: { type: Boolean },
  note: { type: String, default: "" },
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
