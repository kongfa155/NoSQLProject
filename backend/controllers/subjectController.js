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

module.exports={
    getSubjects, addSubject
}