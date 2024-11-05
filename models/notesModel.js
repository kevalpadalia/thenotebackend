const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    createdByName: {
        type: String,
        required: true
    },
    createdById: {
        type: Schema.Types.ObjectId,
        required: true
    },
    projectId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    colors: {
        type:String
    },
    position: {
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('Notes', noteSchema);
