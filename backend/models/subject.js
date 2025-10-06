const mongoose = require("mongoose");


const subjectSchema = new mongoose.Schema({
    // _id là mặc định thằng mongodb sẽ cung cấp và nó là chuỗi khó hiểu 
  name: {type:String},
  image: {type:String},
  description: {type:String},
});

module.exports = mongoose.model("Subject", subjectSchema);
