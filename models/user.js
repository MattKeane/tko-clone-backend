const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    leader: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User