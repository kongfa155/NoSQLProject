const Quiz = require("../models/quiz");
const { getChaptersFromSubject } = require("./chapterController");

const addQuiz = async (req, res) => {
  console.log("Request body:", req.body);
  const { name, subjectId,chapterId, questionNum, availability } = req.body;
  const newQuiz = new Quiz({ name, subjectId, questionNum,chapterId, availability });
  await newQuiz.save();
  res.json(newQuiz);
};

const getQuiz = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};

const getQuizFromChapter = async (req, res) => {
  const quiz = await Quiz.find({ chapterId: req.params.id });
  res.json(quiz);
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz", error });
  }
};

const getQuizBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subjectId: req.params.subjectid });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz theo subject", error });
  }
};
module.exports = {
  getQuiz,
  addQuiz,
  getQuizById,
  getQuizFromChapter,
  getQuizBySubject,
};
