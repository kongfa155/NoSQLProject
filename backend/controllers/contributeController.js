// ===============================================
// File: backend/src/controllers/contributeController.js
// Mục đích: Xử lý toàn bộ logic liên quan đến ĐỀ ĐÓNG GÓP (Contributed Quiz)
// Bao gồm: duyệt đề, từ chối đề, upload CSV, phân trang, thống kê
// ===============================================
// backend/src/controllers/contributeController.js
import Quiz from "../models/quiz.js"; // Model quiz chính thức
import QuestionText from "../models/questionText.js"; // Model câu hỏi dạng chữ
import ContributedQuiz from "../models/contributedQuiz.js"; // Model đề đóng góp
import Subject from "../models/subject.js";
import Chapter from "../models/chapter.js";
import fs from "fs"; // Dùng đọc & xoá file CSV
import csv from "csv-parser"; // Thư viện parse file CSV

// ==============================================================
// 1) Duyệt đề đóng góp → chuyển thành quiz chính thức
// ==============================================================
export const approveContribution = async (req, res) => {
  try {
    //Lấy id của đề đóng góp từ req truyền cho
    const { id } = req.params;
    const contrib = await ContributedQuiz.findById(id);

    //Nếu không tìm thấy được contributed quiz thì báo lỗi
    if (!contrib)
      return res.status(404).json({ message: "Không tìm thấy đóng góp" });

    //Kiểm tra tính hợp lệ của môn học
    let subject = null;
    if (contrib.subjectId) {
      subject = await Subject.findById(contrib.subjectId);
      if (!subject)
        return res.status(400).json({ message: "Môn học không hợp lệ" });
    }

    //Kiểm tra tính hợp lệ của chương
    let chapter = null;
    if (contrib.chapterId) {
      chapter = await Chapter.findById(contrib.chapterId);
      if (!chapter)
        return res.status(400).json({ message: "Chương không hợp lệ" });
    }

    //Tạo quiz mới từ dữ liệu của đề đóng góp
    const quizData = {
      name: contrib.name,
      subjectId: contrib.subjectId || null,
      chapterId: contrib.chapterId || null,
      questionNum: contrib.questions.length,
      timeLimit: contrib.timeLimit || 0,
      availability: true, //Bật trạng thái khả dụng của đề
      note: contrib.adminNote || "", //Nhận ghi chú từ admin nếu có
    };

    const quiz = await Quiz.create(quizData); //Tạo quiz trong db
    // ================== LƯU CÂU HỎI DẠNG TEXT ==================
    const questionsText = contrib.questions
      .filter((q) => !q.image)
      .map((q) => ({
        quizId: quiz._id,
        question: q.question,
        options: q.options,
        answer: q.answer,
        explain: q.explain || "",
      }));
    if (questionsText.length > 0) await QuestionText.insertMany(questionsText);
    //Cập nhật trạng thái của đề đóng góp
    contrib.status = "approved";
    contrib.approvedAt = new Date();
    contrib.approvedBy = req.user?._id || null;
    await contrib.save();
    //Gửi phản hồi cập nhật thành công
    res.json({
      message: "✅ Đã duyệt và tạo quiz thành công!",
      quizId: quiz._id,
    });
  } catch (err) {
    console.error("Lỗi duyệt đóng góp:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==============================================================
// 2) Lấy toàn bộ danh sách đề đóng góp (không phân trang)
// ==============================================================
export const getAllContributedQuizzes = async (req, res) => {
  try {
    const quizzes = await ContributedQuiz.find()
      .populate("contributorId", "username email")
      .populate("subjectId", "name")
      .populate("chapterId", "name")
      .sort({ createdAt: -1 }); // Mới nhất lên đầu
    res.json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách đề đóng góp" });
  }
};
// ==============================================================
// 3) Upload CSV → tạo đề đóng góp
// ==============================================================
export const handleCSVUpload = async (req, res) => {
  try {
    //Kiểm tra xem có file đầu vào không
    if (!req.file)
      return res.status(400).json({ message: "Chưa tải lên file CSV nào!" });
    //Biến lưu đường dẫn và mảng lưu dữ liệu
    const filePath = req.file.path;
    const results = [];
    //Đọc đầu vào bằng thư viện CSV-Parser
    fs.createReadStream(filePath)
      .pipe(
        csv({
          separator: ",", //Phân tách cột bằng dấu phẩy
          quote: '"', // hỗ trợ chuỗi nằm trong ""
          escape: '"', // escape ký tự "
          mapHeaders: ({ header }) => header.replace(/^\ufeff/, ""), // Tránh lỗi ký tự lạ
          trim: true, //Tự động cắt khoảng cắt
        })
      )
      .on("data", (row) => results.push(row)) //Đưa các dòng dữ liệu vào mảng kết quả
      .on("end", async () => { //Sau khi đọc xong đem qua xử lý
        try {
          const questions = results
            .map((r, index) => {
                //Xử lý từng dòng để tạo nên cấu trúc câu hỏi đúng
              if (!r.question || !r.options || !r.answer) {
                console.log("❌ Lỗi dòng:", index + 1, r);
                return null;
              }
              const options = String(r.options)
                .replace(/^"|"$/g, "") // bỏ dấu ngoặc kép 
                .split(";") //Các option ngăn cách bởi dấu ;
                .map((o) => o.trim())
                .filter((o) => o);

              return {
                //Tạo mẫu câu hỏi chuẩn
                question: String(r.question).replace(/^"|"$/g, ""),
                options,
                answer: String(r.answer).replace(/^"|"$/g, ""),
                explain: r.explain
                  ? String(r.explain).replace(/^"|"$/g, "")
                  : "",
              };
            })
            .filter((q) => q !== null);

          // Lấy subject/chapter
          const subjectId = req.body.subjectId || null;
          const chapterId = req.body.chapterId || null;

          const adminNote =
            (!subjectId || subjectId === "") && req.body.suggestedNote
              ? `\n${req.body.suggestedNote}`
              : "";

        //Tạo mốc thời gian là 7 ngày
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            //Đếm số đề đã đóng góp trong 7 ngày
          const recentCount = await ContributedQuiz.countDocuments({
            contributorId: req.user.id,
            createdAt: { $gte: oneWeekAgo },
          });
          //Thông báo nếu vượt giới hạn và chặn 
          if (recentCount >= 99999) {
            return res.status(429).json({
              message:
                "🚫 Bạn đã đạt giới hạn 10 đề đóng góp trong 7 ngày gần nhất. Hãy thử lại sau!",
            });
          }
          //Lưu đề đóng góp vào database
          await ContributedQuiz.create({
            contributorId: req.user.id,
            name: req.body.name || "Đề đóng góp từ CSV",
            subjectId,
            chapterId,
            questionNum: questions.length,
            timeLimit: req.body.timeLimit || 45,
            questions,
            adminNote,
          });

          fs.unlinkSync(filePath);
          res.json({ message: "✅ Upload CSV thành công!" });
        } catch (err) {
          console.error("CSV save error:", err);
          res.status(500).json({ message: "Lỗi khi lưu đề đóng góp!" });
        }
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================================================
// 4) Từ chối đề đóng góp
// ==============================================================
export const rejectContribution = async (req, res) => {
  try {
    //Lấy id của đề
    const { id } = req.params;
    const contrib = await ContributedQuiz.findById(id);
    //Tìm trong db
    if (!contrib) {
      return res.status(404).json({ message: "Không tìm thấy đóng góp" });
    }
    //Cập nhật trạng thái
    contrib.status = "rejected";
    contrib.rejectedAt = new Date();
    contrib.rejectedBy = req.user?._id || null;
    await contrib.save();

    res.json({ message: `❌ Đã từ chối đề "${contrib.name}".` });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi từ chối đề đóng góp!" });
  }
};
// ==============================================================
// 5) Lấy chi tiết một đề đóng góp
// ==============================================================
export const getDetailContributedQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    //Join với dữ liệu người dùng, chương, môn học để hiển thị ra
    const contrib = await ContributedQuiz.findById(id)
      .populate("contributorId", "username email")
      .populate("subjectId", "name")
      .populate("chapterId", "name");

    if (!contrib) {
      return res.status(404).json({ message: "Không tìm thấy đề đóng góp." });
    }

    res.json(contrib);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy đề đóng góp." });
  }
};
// ==============================================================
// 6) Lấy danh sách đề đóng góp (có phân trang + sắp xếp trạng thái)
// ==============================================================
export const getContributedQuizzesPaginated = async (req, res) => {
  try {
    //Lấy dưới dạng query trên thanh tìm kiếm (Dạng ?page=1&limit=5)
    const page = parseInt(req.query.page) || 1; //Trang hiện tại
    const limit = parseInt(req.query.limit) || 5; //Số đề mỗi trang
    const skip = (page - 1) * limit; //Bỏ qua bao nhiêu document đầu tiên

    const total = await ContributedQuiz.countDocuments(); //Đếm tổng số document hiện có
    //Xử lý hàm kết tập
    const quizzes = await ContributedQuiz.aggregate([
      {
        //Thêm trường để xếp hạng contributed quiz (Trọng số càng cao, càng chìm xuống sâu)
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ["$status", "pending"] }, then: 1 },
                { case: { $eq: ["$status", "approved"] }, then: 2 },
                { case: { $eq: ["$status", "rejected"] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { statusOrder: 1, createdAt: -1 } }, //Sắp xếp theo thứ tự theo trọng số rồi tới thời gian tạo
      { $skip: skip },
      { $limit: limit },
    ]);
    //Join dữ liệu như bình thường để lấy người đóng góp
    await ContributedQuiz.populate(quizzes, [
      { path: "contributorId", select: "username email" },
      { path: "subjectId", select: "name" },
      { path: "chapterId", select: "name" },
    ]);

    res.json({
      data: quizzes,
      total,
      pageCount: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách đóng góp có phân trang." });
  }
};

// ==============================================================
// 7) Lấy thống kê số lượng đề đã đóng góp trong 7 ngày
// ==============================================================
export const getContributionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const totalWeek = await ContributedQuiz.countDocuments({
      contributorId: userId,
      createdAt: { $gte: oneWeekAgo },
    });

    res.json({
      limit: 10,
      used: totalWeek,
      remaining: Math.max(0, 99999 - totalWeek),
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy thống kê đóng góp!" });
  }
};
