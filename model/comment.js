const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
        minLength: 1,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    sendAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('comment', commentSchema);
