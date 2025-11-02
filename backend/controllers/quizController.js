// 📁 controllers/quizController.js
import Quiz from "../models/quiz.js";
import Question from "../models/questionText.js";
import QuestionIMG from "../models/questionImage.js";
import { getChaptersFromSubject } from "./chapterController.js";

// 🟩 Thêm quiz mới
export const addQuiz = async (req, res) => {
  console.log("Request body:", req.body);
  const { name, subjectId, chapterId, questionNum, availability } = req.body;
  const newQuiz = new Quiz({
    name,
    subjectId,
    questionNum,
    chapterId,
    availability,
  });
  await newQuiz.save();
  res.json(newQuiz);
};

// 🟩 Cập nhật quiz (bao gồm cả câu hỏi)
export const updateQuizFull = async (req, res) => {
  try {
    const { name, questions, timeLimit, chapterId } = req.body;
    const quizId = req.params.id;

    const quiz = await Quiz.findByIdAndUpdate(
      quizId,
      { name, timeLimit, chapterId },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }

    if (Array.isArray(questions)) {
      for (const q of questions) {
        if (q._id) {
          if (q.image && q.image.trim() !== "") {
            await QuestionIMG.findByIdAndUpdate(q._id, q);
          } else {
            await Question.findByIdAndUpdate(q._id, q);
          }
        } else {
          if (q.image && q.image.trim() !== "") {
            await QuestionIMG.create({ ...q, quizId });
          } else {
            await Question.create({ ...q, quizId });
          }
        }
      }
    }

    res.json({
      message: "✅ Cập nhật quiz và câu hỏi thành công",
      updatedQuiz: quiz,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật quiz:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật quiz" });
  }
};

// 🟩 Cập nhật trạng thái availability
export const updateQuizAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
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

// 🟩 Lấy tất cả quiz
export const getQuiz = async (req, res) => {
  const quizzes = await Quiz.find().lean();
  res.json(quizzes);
};

// 🟩 Lấy quiz theo chương
export const getQuizFromChapter = async (req, res) => {
  const quiz = await Quiz.find({ chapterId: req.params.id }).lean();
  res.json(quiz);
};

// 🟩 Xóa quiz
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Not found quiz" });
    }
    res.json({ message: "Xóa quiz thành công", deletedSubject: quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xóa quiz" });
  }
};

// 🟩 Lấy quiz theo ID (gồm cả câu hỏi text và hình)
export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy quiz" });
    }

    const question = await Question.find({ quizId: req.params.id });
    const questionImage = await QuestionIMG.find({ quizId: req.params.id });
    const questions = [...question, ...questionImage];

    res.json({
      ...quiz.toObject(),
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz", error });
  }
};

// 🟩 Lấy quiz theo subject
export const getQuizBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subjectId: req.params.subjectid });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy quiz theo subject", error });
  }
};
