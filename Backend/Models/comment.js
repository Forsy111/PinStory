const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    story: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Story"
    },
    content: {
        type: String,
        required: [true, "Please provide a content"],
        minlength: [3, "Введите минимум 3 символа"],
        maxlength: [220, "Максимальное количество символов 220"],
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
}, { timestamps: true })


const Comment = mongoose.model("Comment", CommentSchema)

module.exports = Comment;