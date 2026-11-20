const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({

    title: {
        type: String,
        trim: true,
        minLength: 8,
        maxLength: 100,
        required: true,
    },
    body: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 2000,
        trim: true
    },
    imagePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

blogSchema.index({title: "text"});

module.exports = mongoose.model('Blog', blogSchema);
