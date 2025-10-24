import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
  description: { type: String },
  availability: { type: Boolean },
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
