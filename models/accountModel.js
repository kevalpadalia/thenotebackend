const mongoose = require("mongoose");

const Schema = mongoose.Schema

const accountSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required:false
    },
    password: {
        type: String,
        required:true
    },
    loggedIn: {
        type: Boolean,
        required:true
    },
    lastLogin: {
        type: Date,
        required:true
    }
}, { timestamps: true })

module.exports = mongoose.model('Accounts',accountSchema)