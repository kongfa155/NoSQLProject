// backend/src/controllers/questionController.js
import Question from "../models/questionText.js";

// Lấy tất cả câu hỏi
export const getQuestions = async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
};

// Lấy câu hỏi theo quizId
export const getQuestionsById = async (req, res) => {
  const questions = await Question.find({ quizId: req.params.id });
  res.json(questions);
};

// Thêm câu hỏi mới
export const addQuestion = async (req, res) => {
  const { quizId, question, options, answer } = req.body;
  const newQuestion = new Question({ quizId, question, options, answer });
  await newQuestion.save();
  res.json(newQuestion);
};

// Xóa câu hỏi
export const deleteQuestion = async (req, res) => {
  await Question.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};
