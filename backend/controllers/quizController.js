const Quiz = require('../models/quiz');

const addQuiz= async (req,res)=>{
     console.log("Request body:", req.body);
    const {name, subjectId, questionNum, availability} = req.body;
    const newQuiz = new Quiz({name,subjectId, questionNum, availability});
    await newQuiz.save();
    res.json(newQuiz);
};

const getQuiz = async(req,res)=>{
    const quizzes = await Quiz.find();
    res.json(quizzes);
};


const getQuizFromSubject = async(req,res)=>{
    const quiz = await Quiz.find({subjectId: req.params.id});
    res.json(quiz);
}

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
module.exports = {
  getQuiz,
  addQuiz,
  getQuizFromSubject,
  getQuizById,
};