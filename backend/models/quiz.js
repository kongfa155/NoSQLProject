const mongoose = require("mongoose");

const quizSchema =  new mongoose.Schema({
    name: {type: String},
    subjectId: {type: mongoose.Schema.Types.ObjectId, ref:"Subject",},
    questionNum: {type: Number},
    timeLimit: {type: Number},
    availability: {type: Boolean},
});

module.exports = mongoose.model("Quiz", quizSchema);