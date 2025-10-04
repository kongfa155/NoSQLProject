const Submission = require("../models/submission");

const getSubmissions = async (req, res)=>{
    const  submissions = await Submission.find();
    res.json(submissions);
};

const addSubmission = async (req,res)=>{
    const {userId, quizId, answers, score } = req.body;
    const newSubmission = new Submission({userId, quizId, answers, score });
    await newSubmission.save();
    res.json(newSubmission);
};

module.exports={
    getSubmissions, addSubmission
}