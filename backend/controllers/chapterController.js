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
const updateChapterAvailability = async (req, res) => {
  try {
    const { availability } = req.body; // chỉ lấy trường cần update
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { availability },             // chỉ update trường này
      { new: true }         // trả về document sau khi update
    );

    if (!chapter) {
      return res.status(404).json({ message: "Không tìm thấy chapter" });
    }

    res.json({ message: "Cập nhật thành công", updatedChapter: chapter });
  } catch (error) {
    console.error("Lỗi khi cập nhật chapter:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật chapter" });
  }
};
module.exports = {
    addChapter, getChapters, getChaptersFromSubject, updateChapterAvailability
}