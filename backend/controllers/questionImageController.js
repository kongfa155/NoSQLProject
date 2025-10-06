const QuestionImage = require("../models/questionImage");

// Lấy tất cả câu hỏi
const getQuestionImages = async (req, res) => {
  const questions = await QuestionImage.find();
  res.json(questions);
};

const getQuestionImagesById = async (req, res) => {
  const questions = await QuestionImage.find({quizId: req.params.id});
  res.json(questions);
};


// Thêm câu hỏi
const addQuestionImage = async (req, res) => {
    //Nhận dữ liệu được truyền
  const { quizId, question, image, options, answer, explain } = req.body;
  //Tạo mới biến để lưu dữ liệu
  const newQuestionImage = new QuestionImage({ quizId, question, image, options, answer, explain });
  await newQuestionImage.save(); //Tải dữ liệu lên
  res.json(newQuestionImage); //Backend gửi lại dữ liệu cho front end dưới dạng JSON cái này chưa cần xài
};


// Xóa câu hỏi
const deleteQuestionImage = async (req, res) => {
    //Nhận id được truyền
  await QuestionImage.findByIdAndDelete(req.params.id);
  //xóa xong trả về thông tin cho front end
  res.json({ message: "Deleted successfully" });
};


//Đẩy các hàm này ra ngoài cho bên khác dùng
module.exports = {
  getQuestionImages,
  addQuestionImage,
  deleteQuestionImage,
  getQuestionImagesById,
};
