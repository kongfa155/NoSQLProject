// 📁 controllers/subjectController.js
import Subject from "../models/subject.js";

export const getSubjects = async (req, res) => {
  const subjects = await Subject.find();
  res.json(subjects);
};

export const addSubject = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    const newSubject = new Subject({ name, image, description });
    await newSubject.save();
    res.json(newSubject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi thêm môn học" });
  }
};

export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: "Not found subject" });
    }
    res.json({ message: "Xóa môn học thành công", deletedSubject: subject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xóa môn học" });
  }
};

export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject)
      return res.status(404).json({ message: "Không tìm thấy subject" });
    res.json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
