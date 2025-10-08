// seed.js
const axios = require("axios");

const API_BASE = "http://localhost:5000/api";

async function seed() {
  try {
    console.log("=== Bắt đầu seed dữ liệu ===");

    // 1️⃣ Tạo Subject
    const subjectsData = [
      {
        name: "Cơ sở lập trình",
        image: "https://example.com/cslp.png",
        description: "Nhập môn lập trình căn bản cho sinh viên CNTT",
      },
      {
        name: "Cấu trúc dữ liệu",
        image: "https://example.com/ctdl.png",
        description: "Môn học về danh sách, cây, đồ thị, và giải thuật cơ bản",
      },
    ];

    const subjects = [];
    for (const s of subjectsData) {
      const res = await axios.post(`${API_BASE}/subjects`, s);
      subjects.push(res.data);
    }
    console.log(
      "✅ Đã tạo Subjects:",
      subjects.map((s) => s.name)
    );

    // 2️⃣ Tạo Quiz (mỗi quiz thuộc 1 subject)
    const quizzesData = [
      {
        name: "Quiz 1: Biến và kiểu dữ liệu",
        subjectId: subjects[0]._id,
        questionNum: 3,
        availability: true,
      },
      {
        name: "Quiz 2: Danh sách liên kết",
        subjectId: subjects[1]._id,
        questionNum: 2,
        availability: true,
      },
    ];

    const quizzes = [];
    for (const q of quizzesData) {
      const res = await axios.post(`${API_BASE}/quizzes`, q);
      quizzes.push(res.data);
    }
    console.log(
      "✅ Đã tạo Quizzes:",
      quizzes.map((q) => q.name)
    );

    // 3️⃣ Tạo QuestionText (cho quiz 1)
    const questionsTextData = [
      {
        quizId: quizzes[0]._id,
        question: "Kiểu dữ liệu nào dùng để lưu chuỗi ký tự?",
        options: ["int", "string", "float", "boolean"],
        answer: "string",
      },
      {
        quizId: quizzes[0]._id,
        question: "Phép gán hợp lệ trong C là?",
        options: ["x == 5;", "x = 5;", "x := 5;", "5 = x;"],
        answer: "x = 5;",
      },
    ];

    for (const qt of questionsTextData) {
      await axios.post(`${API_BASE}/questions`, qt);
    }
    console.log("✅ Đã tạo QuestionText");

    // 4️⃣ Tạo QuestionImage (cho quiz 2)
    const questionsImageData = [
      {
        quizId: quizzes[1]._id,
        question: "Hình dưới minh họa cho cấu trúc gì?",
        image: "https://example.com/linkedlist.png",
        options: ["Stack", "Queue", "Linked List", "Tree"],
        answer: "Linked List",
        explain: "Các node nối với nhau bằng con trỏ next.",
      },
    ];

    for (const qi of questionsImageData) {
      await axios.post(`${API_BASE}/questionImages`, qi);
    }
    console.log("✅ Đã tạo QuestionImage");

    // 5️⃣ (Tùy chọn) Tạo Submission demo
    const submission = {
      userId: null,
      quizId: quizzes[0]._id,
      answers: ["string", "x = 5;"],
      score: 2,
    };
    await axios.post(`${API_BASE}/submissions`, submission);
    console.log("✅ Đã tạo Submission");

    console.log("🎉 Seed hoàn tất!");
  } catch (err) {
    console.error("❌ Lỗi khi seed dữ liệu:", err.message);
  }
}

seed();
