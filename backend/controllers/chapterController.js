// backend/src/controllers/chapterController.js
import Chapter from "../models/chapter.js";

export const addChapter = async (req, res) => {
  try {
    const { name, subjectId, description, order, availability } = req.body;
    const newChapter = new Chapter({
      name,
      subjectId,
      description,
      order,
      availability,
    });
    await newChapter.save();
    res.json(newChapter);
  } catch (err) {
    console.error("Lỗi thêm chapter:", err);
    res.status(500).json({ message: "Lỗi khi thêm chapter" });
  }
};

export const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find();
    res.json(chapters);
  } catch (err) {
    console.error("Lỗi khi lấy danh sách chương:", err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách chương" });
  }
};

export const getChaptersFromSubject = async (req, res) => {
  try {
    const chapters = await Chapter.find({ subjectId: req.params.id });
    res.json(chapters);
  } catch (err) {
    console.error("Lỗi khi lấy chương từ subject:", err);
    res.status(500).json({ message: "Lỗi khi lấy chương từ subject" });
  }
};

export const updateChapterAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const chapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true }
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
