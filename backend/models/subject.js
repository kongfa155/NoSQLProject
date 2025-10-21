import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String },
  image: { type: String },
  description: { type: String },
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
