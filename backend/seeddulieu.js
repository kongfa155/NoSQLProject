const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Import models
const Chapter = require("./models/chapter");
const Quiz = require("./models/quiz");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const subjects = [
  {
    _id: new mongoose.Types.ObjectId("68e31450357b5d5eac2e2add"),
    name: "Lập trình căn bản",
  },
  {
    _id: new mongoose.Types.ObjectId("68e31451357b5d5eac2e2adf"),
    name: "Cấu trúc dữ liệu",
  },
  {
    _id: new mongoose.Types.ObjectId("68e334e1683216059b6cb76a"),
    name: "Triết học mác lê nin",
  },
  {
    _id: new mongoose.Types.ObjectId("68e335d7683216059b6cb76b"),
    name: "300 bài code thiếu nhi",
  },
];

const seed = async () => {
  try {
    await Chapter.deleteMany();
    await Quiz.deleteMany();

    console.log("🧹 Đã xóa dữ liệu cũ trong Chapter và Quiz");

    const chaptersData = [];

    // --- Lập trình căn bản ---
    chaptersData.push(
      { name: "Giới thiệu ngôn ngữ lập trình", subjectId: subjects[0]._id, description: "Hiểu khái niệm lập trình và ngôn ngữ lập trình.", order: 1, availability: true },
      { name: "Cấu trúc rẽ nhánh và lặp", subjectId: subjects[0]._id, description: "Câu lệnh if, for, while trong lập trình cơ bản.", order: 2, availability: true },
      { name: "Hàm và biến cục bộ", subjectId: subjects[0]._id, description: "Tổ chức chương trình bằng hàm.", order: 3, availability: true }
    );

    // --- Cấu trúc dữ liệu ---
    chaptersData.push(
      { name: "Mảng và danh sách liên kết", subjectId: subjects[1]._id, description: "Tổng quan về cấu trúc lưu trữ tuyến tính.", order: 1, availability: true },
      { name: "Ngăn xếp và hàng đợi", subjectId: subjects[1]._id, description: "Ứng dụng stack và queue trong thuật toán.", order: 2, availability: true },
      { name: "Cây và đồ thị", subjectId: subjects[1]._id, description: "Các dạng cấu trúc phân cấp và kết nối.", order: 3, availability: true }
    );

    // --- Triết học Mác Lênin ---
    chaptersData.push(
      { name: "Chủ nghĩa duy vật biện chứng", subjectId: subjects[2]._id, description: "Nền tảng lý luận của triết học Mác.", order: 1, availability: true },
      { name: "Chủ nghĩa duy vật lịch sử", subjectId: subjects[2]._id, description: "Quan điểm của Mác về lịch sử và xã hội.", order: 2, availability: true }
    );

    // --- 300 bài code thiếu nhi ---
    chaptersData.push(
      { name: "Bài tập vòng lặp cơ bản", subjectId: subjects[3]._id, description: "Những bài luyện tập for và while cho người mới học.", order: 1, availability: true },
      { name: "Bài tập đệ quy vui vẻ", subjectId: subjects[3]._id, description: "Giúp trẻ nhỏ hiểu đệ quy thông qua ví dụ đơn giản.", order: 2, availability: true }
    );

    const createdChapters = await Chapter.insertMany(chaptersData);
    console.log(`✅ Đã thêm ${createdChapters.length} chương`);

    // Tạo quiz cho mỗi chương
    const quizzesData = createdChapters.flatMap((ch, i) => [
      {
        name: `Bộ đề luyện tập ${ch.name}`,
        subjectId: ch.subjectId,
        chapterId: ch._id,
        questionNum: Math.floor(Math.random() * 10) + 5, // random 5–15 câu
        timeLimit: 10 + Math.floor(Math.random() * 10), // random 10–20 phút
        availability: true,
      },
      {
        name: `Kiểm tra nhanh ${ch.name}`,
        subjectId: ch.subjectId,
        chapterId: ch._id,
        questionNum: 5,
        timeLimit: 5,
        availability: true,
      }
    ]);

    const createdQuizzes = await Quiz.insertMany(quizzesData);
    console.log(`✅ Đã thêm ${createdQuizzes.length} bộ đề`);

  } catch (error) {
    console.error("❌ Lỗi khi seed:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();
