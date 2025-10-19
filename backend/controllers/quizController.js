const Quiz = require("../models/quiz");
const Question = require("../models/questionText") //Thêm thằng này để lấy được question
const QuestionIMG = require("../models/questionImage") //Thằng này để lấy câu hỏi có hình
const { getChaptersFromSubject } = require("./chapterController");

const addQuiz = async (req, res) => {
  console.log("Request body:", req.body);
  const { name, subjectId,chapterId, questionNum, availability } = req.body;
  const newQuiz = new Quiz({ name, subjectId, questionNum,chapterId, availability });
  await newQuiz.save();
  res.json(newQuiz);
};
const updateQuizFull = async (req, res) => {
  try {
    const { name, questions, timeLimit ,chapterId} = req.body;
    const quizId = req.params.id;

    // 1️⃣ Cập nhật quiz
    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { name, timeLimit, chapterId },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }

    // 2️⃣ Duyệt từng câu hỏi để cập nhật hoặc thêm mới
    if (Array.isArray(questions)) {
      for (const q of questions) {
        if (q._id) {
          // Cập nhật câu hỏi đã có
          if (q.image && q.image.trim() !== "") {
            await QuestionIMG.findByIdAndUpdate(q._id, q);
          } else {
            await Question.findByIdAndUpdate(q._id, q);
          }
        } else {
          // ✅ Nếu là câu hỏi mới thì thêm vào DB
          if (q.image && q.image.trim() !== "") {
            await QuestionIMG.create({ ...q, quizId });
          } else {
            await Question.create({ ...q, quizId });
          }
        }
      }
    }

    res.json({ message: "✅ Cập nhật quiz và câu hỏi thành công", updatedQuiz: quiz });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật quiz:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật quiz" });
  }
};

const updateQuizAvailability = async (req, res) => {
  try {
    const { availability } = req.body; // chỉ lấy trường cần update
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { availability },             // chỉ update trường này
      { new: true }         // trả về document sau khi update
    );

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }

    res.json({ message: "Cập nhật thành công", updatedQuiz: quiz });
  } catch (error) {
    console.error("Lỗi khi cập nhật quiz:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật quiz" });
  }
};
const getQuiz = async (req, res) => {
  const quizzes = await Quiz.find();
  res.json(quizzes);
};

const getQuizFromChapter = async (req, res) => {
  const quiz = await Quiz.find({ chapterId: req.params.id });
  res.json(quiz);
};

const deleteQuiz = async (req, res) =>{
  try{
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if(!quiz){
      return res.status(404).json({message: "Not found quiz"});
    }
    res.json({ message: "Xóa quiz thành công", deletedSubject: quiz });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xóa quiz "});
  }
}


const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }
    //Lấy câu hỏi text thuộc quiz
    const question = await Question.find({quizId: req.params.id});
    //Lấy câu hỏi có hình
    const questionImage = await QuestionIMG.find({quizId: req.params.id})
    const questions = [...question, ...questionImage];
    res.json({
      ...quiz.toObject(),
      questions,
    });
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
  updateQuizAvailability,
  getQuiz,
  addQuiz,
  getQuizById,
  getQuizFromChapter,
  getQuizBySubject, 
  deleteQuiz,
  updateQuizFull,
};
