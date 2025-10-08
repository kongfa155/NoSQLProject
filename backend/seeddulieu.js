const mongoose = require("mongoose");
const Question = require("./models/questionText.js");
const { resolveConfig } = require("vite");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)

const quizIds = [
  "68e09d521032407fcc2b7564", // Bí kíp cua gái nhà họ Nguyễn
  "68e0bd09d4d61556ac458027", // Cách chiến thắng Godzilla với tay không
  "68e0bd9cd4d61556ac458028", // Làm thế nào để thoát khỏi ách thống trị của bồ nông
  "68e0be6ad4d61556ac458029", // Ngươi mở miệng ra là nhắc đến hai chữ công bằng...
];

// Helper để sinh options và answer
function generateQuestionText(index, quizName) {
  return `Câu hỏi ${index + 1} thuộc bộ đề "${quizName}" là gì?`;
}

async function seed() {
  try {
    await Question.deleteMany({}); // Xóa dữ liệu cũ cho sạch

    const allQuestions = [];

    quizIds.forEach((id, quizIndex) => {
      for (let i = 0; i < 10; i++) {
        const options = [
          `Đáp án A của câu ${i + 1}`,
          `Đáp án B của câu ${i + 1}`,
          `Đáp án C của câu ${i + 1}`,
          `Đáp án D của câu ${i + 1}`,
        ];

        const answer = options[Math.floor(Math.random() * options.length)];

        allQuestions.push({
          quizId: new mongoose.Types.ObjectId(id),
          question: generateQuestionText(i, `Quiz ${quizIndex + 1}`),
          options,
          answer,
        });
      }
    });

    await Question.insertMany(allQuestions);
    console.log("✅ Seed 10 câu hỏi/quiz xong!");
  } catch (err) {
    console.error("❌ Lỗi seed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();















