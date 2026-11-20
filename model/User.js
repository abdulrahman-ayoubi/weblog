const mongoose = require('mongoose');

// mongoose schema
const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        min: 4,
        max: 255,
        required: true,
        trim: true,

    },
    email: {
        type: String,
        trim: true,
        normalize: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 4,
        max: 255,
        required: true
    },
    imagePath: {
        type: String,
        default: "default/Annotation 2023-11-27 183522.png"
    },
    createAt: {
        type: Date,
        defaultValue: Date.now(),

    },

})

module.exports = mongoose.model('User', userSchema);