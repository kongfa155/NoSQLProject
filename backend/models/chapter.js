const mongoose = require('mongoose');


const chapterSchema =  new mongoose.Schema({
    name: {type: String},
    subjectId: {type: mongoose.Schema.Types.ObjectId, ref:"Subject",},
    description: {type: String},
    order: {type: Number},
    availability: {type: Boolean},
});

module.exports = mongoose.model("Chapter", chapterSchema);