const Subject = require("../models/subject");

const getSubjects = async (req, res)=>{
    const  subjects = await Subject.find();
    res.json(subjects);
};

const addSubject = async (req,res)=>{
    const {name, image, description } = req.body;
    const newSubject = new Subject({name, image, description });
    await newSubject.save();
    res.json(newSubject);
};

const getSubjectById = async(req,res)=>{
    const subject = await Subject.find({_id: req.params.id});
    res.json(subject);

}
module.exports={
    getSubjects, addSubject, getSubjectById
}