const Question = require("../models/Question");

// Lấy tất cả câu hỏi
const getQuestions = async (req, res) => {
  const questions = await Question.find();
  res.json(questions);
};

// Thêm câu hỏi
const addQuestion = async (req, res) => {
    //Nhận dữ liệu được truyền
  const { question, options, answer } = req.body;
  //Tạo mới biến để lưu dữ liệu
  const newQuestion = new Question({ question, options, answer });
  await newQuestion.save(); //Tải dữ liệu lên
  res.json(newQuestion); //Backend gửi lại dữ liệu cho front end dưới dạng JSON cái này chưa cần xài
};


// Xóa câu hỏi
const deleteQuestion = async (req, res) => {
    //Nhận id được truyền
  await Question.findByIdAndDelete(req.params.id);
  //xóa xong trả về thông tin cho front end
  res.json({ message: "Deleted successfully" });
};


//Đẩy các hàm này ra ngoài cho bên khác dùng
module.exports = {
  getQuestions,
  addQuestion,
  deleteQuestion,
};
