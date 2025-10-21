// 📁 controllers/questionImageController.js
import QuestionImage from "../models/questionImage.js";

// Lấy tất cả câu hỏi
export const getQuestionImages = async (req, res) => {
  const questions = await QuestionImage.find();
  res.json(questions);
};

export const getQuestionImagesById = async (req, res) => {
  const questions = await QuestionImage.find({ quizId: req.params.id });
  res.json(questions);
};

// Thêm câu hỏi
export const addQuestionImage = async (req, res) => {
  const { quizId, question, image, options, answer, explain } = req.body;
  const newQuestionImage = new QuestionImage({
    quizId,
    question,
    image,
    options,
    answer,
    explain,
  });
  await newQuestionImage.save();
  res.json(newQuestionImage);
};

// Xóa câu hỏi
export const deleteQuestionImage = async (req, res) => {
  await QuestionImage.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};
