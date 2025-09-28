const mongoose = require("mongoose");
//Này định nghĩa cấu trúc dữ liệu
const questionSchema = new mongoose.Schema({
    // _id là mặc định thằng mongodb sẽ cung cấp và nó là chuỗi khó hiểu 
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
