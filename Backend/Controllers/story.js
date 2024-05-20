const asyncErrorWrapper = require("express-async-handler")
const Story = require("../Models/story");
const deleteImageFile = require("../Helpers/Libraries/deleteImageFile");
const { searchHelper, paginateHelper } = require("../Helpers/query/queryHelpers")

// создать пост
const addStory = asyncErrorWrapper(async (req, res, next) => {

    const { title, content } = req.body
    try {
        const newStory = await Story.create({
            title,
            content,
            author: req.user._id,
            image: req.savedStoryImage,
        })

        return res.status(200).json({
            success: true,
            message: "Пост создан ",
            data: newStory
        })
    }
    catch (error) {
        deleteImageFile(req)
        return next(error)
    }
})

// вывод всех постов
const getAllStories = asyncErrorWrapper(async (req, res, next) => {
    let query = Story.find();
    query = searchHelper("title", query, req)
    const paginationResult = await paginateHelper(Story, query, req)
    query = paginationResult.query;
    query = query.sort("-likeCount -commentCount -createdAt")
    const stories = await query
    return res.status(200).json({
        success: true,
        count: stories.length,
        data: stories,
        page: paginationResult.page,
        pages: paginationResult.pages
    })
})

// вывод одного поста
const detailStory = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const { activeUser } = req.body
    const story = await Story.findOne({
        slug: slug
    }).populate("author likes")
    const storyLikeUserIds = story.likes.map(json => json.id)
    const likeStatus = storyLikeUserIds.includes(activeUser._id)
    return res.status(200).
        json({
            success: true,
            data: story,
            likeStatus: likeStatus
        })
})

// лайк на пост
const likeStory = asyncErrorWrapper(async (req, res, next) => {
    const { activeUser } = req.body
    const { slug } = req.params;
    const story = await Story.findOne({
        slug: slug
    }).populate("author likes")
    const storyLikeUserIds = story.likes.map(json => json._id.toString())
    if (!storyLikeUserIds.includes(activeUser._id)) {
        story.likes.push(activeUser)
        story.likeCount = story.likes.length
        await story.save();
    }
    else {

        const index = storyLikeUserIds.indexOf(activeUser._id)
        story.likes.splice(index, 1)
        story.likeCount = story.likes.length
        await story.save();
    }
    return res.status(200).
        json({
            success: true,
            data: story
        })
})

// страница редактирования поста
const editStoryPage = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const story = await Story.findOne({
        slug: slug
    })
    return res.status(200).
        json({
            success: true,
            data: story
        })
})

// изменить пост
const editStory = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const { title, content, image, previousImage } = req.body;
    const story = await Story.findOne({ slug: slug })
    story.title = title;
    story.content = content;
    story.image = req.savedStoryImage;
    if (!req.savedStoryImage) {
        // если новая картинка не загружена
        story.image = image
    }
    else {
        // если новая картинка
        // удалить старую
        deleteImageFile(req, previousImage)
    }
    await story.save();
    return res.status(200).
        json({
            success: true,
            data: story
        })
})

// удалить пост
const deleteStory = asyncErrorWrapper(async (req, res, next) => {
    const { slug } = req.params;
    const story = await Story.findOne({ slug: slug })
    deleteImageFile(req, story.image);
    await story.remove()
    return res.status(200).
        json({
            success: true,
            message: "Пост удален "
        })
})

module.exports = {
    addStory,
    getAllStories,
    detailStory,
    likeStory,
    editStoryPage,
    editStory,
    deleteStory
}