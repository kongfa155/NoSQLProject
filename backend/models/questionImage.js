const mongoose = require("mongoose");


const questionSchema = new mongoose.Schema({
    // _id là mặc định thằng mongodb sẽ cung cấp và nó là chuỗi khó hiểu 
  quizId: {type: mongoose.Schema.Types.ObjectId, ref:"Quiz", index:true},
  question: { type: String, required: true },
  image: {type:String},
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
  explain: {type: String},
});

module.exports = mongoose.model("QuestionImage", questionSchema);
