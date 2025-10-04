const mongoose = require("mongoose");

const submissionSchema =  new mongoose.Schema({
    userId:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
    quizId:{type: mongoose.Schema.Types.ObjectId, ref:"Quiz"},
    answers:{type: Object},
    score: {type: Number},

});

module.exports = mongoose.model("Submission", submissionSchema);