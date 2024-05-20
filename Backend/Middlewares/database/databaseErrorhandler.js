const asyncErrorWrapper = require("express-async-handler")
const CustomError = require("../../Helpers/error/CustomError");
const Story = require("../../Models/story")

const checkStoryExist = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const story = await Story.findOne({
        slug: slug
    })
    if (!story) {
        return next(new CustomError("Таково поста нет ", 400))
    }
    next();
})

const checkUserAndStoryExist = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params
    const story = await Story.findOne({
        slug: slug,
        author: req.user
    })
    if (!story && req.user.role !== 'admin') {
        return next(new CustomError("Нет истории пользователя ", 400))
    }
    next();
})

module.exports = {
    checkStoryExist,
    checkUserAndStoryExist
}
