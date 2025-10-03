const mongoose = require("mongoose");

const quizzSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    subjectId: {type: mongoose.Schema.Types.ObjectId, required: true },
    questions: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    availability: {type: Boolean, required: true},
});

module.exports = mongoose.model("Quizz", quizzSchema);