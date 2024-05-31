const mongoose = require("mongoose")
const Comment = require("./comment")
const slugify = require("slugify")

const StorySchema = new mongoose.Schema({

    author: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    slug: String,
    title: {
        type: String,
        required: [true, "Введите заголовок"],
        unique: true,
        minlength: [4, "Введите минимум 4 символа у заголовка "],
        maxlength: [22, "Максимальное количество символов - 22"],
    },
    content: {
        type: String,
        required: [true, "Введите описание "],
        minlength: [10, "Введите минимум 10 символа у описания "],
        maxlength: [220, "Максимальное количество символов - 220"],
    },
    image: {
        type: String,
        default: "default.jpg"
    },
    // readtime: {
    //     type: Number,
    //     default: 3
    // },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }],
    likeCount: {
        type: Number,
        default: 0
    },
    comments: [{
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
    }],
    commentCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

StorySchema.pre("save",  function (next) {

    if (!this.isModified("title")) {
        next();
    }
    this.slug = this.makeSlug()
    next()
})

StorySchema.pre("remove", async function (next) {
    const story= await Story.findById(this._id)
    await Comment.deleteMany({
        story : story 
    })
})

StorySchema.methods.makeSlug = function () {
    return slugify(this.title, {
        replacement: '-',
        remove: /[*+~.()'"!:@/?]/g,
        lower: true,
        strict: false,
        locale: 'tr',
        trim: true
    })
}

const Story = mongoose.model("Story", StorySchema)
module.exports = Story;