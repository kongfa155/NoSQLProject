import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  name: { type: String },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
  description: { type: String },
  order: { type: Number },
  availability: { type: Boolean },
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;
