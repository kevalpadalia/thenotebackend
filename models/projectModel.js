const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    createdByName: {
        type: String,
        required: true
    },
    createdById: {
        type: Schema.Types.ObjectId,
        required: true
    },
    members: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            userName: {
                type: String,
                required: true
            },
            accessList: {
                type: [String],
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
