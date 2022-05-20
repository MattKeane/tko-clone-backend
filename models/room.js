const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    accessCode: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now,
    },
    open: {
        type: Boolean,
        default: true,
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
})

const Room = mongoose.model('Room', roomSchema)

module.exports = Room