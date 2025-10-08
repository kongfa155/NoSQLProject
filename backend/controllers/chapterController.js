const Chapter = require('../models/chapter');

const addChapter= async (req,res)=>{
    const {name, subjectId, description, order, availability} = req.body;
    const newChapter = new Chapter({name, subjectId, description, order, availability});
    await newChapter.save();
    res.json(newChapter);
};

const getChapters = async(req,res)=>{
    const chapters = await Chapter.find();
    res.json(chapters);
};


const getChaptersFromSubject = async(req,res)=>{
    const chapters = await Chapter.find({subjectId: req.params.id});
    res.json(chapters);
}

module.exports = {
    addChapter, getChapters, getChaptersFromSubject
}