const express = require("express")
const { getAccessToRoute } = require("../Middlewares/Authorization/auth");
const { addNewCommentToStory, getAllCommentByStory, commentLike, getCommentLikeStatus, deleteComment } = require("../Controllers/comment")
const { checkStoryExist } = require("../Middlewares/database/databaseErrorhandler");
const router = express.Router();

router.post("/:slug/addComment", [getAccessToRoute, checkStoryExist], addNewCommentToStory)
router.get("/:slug/getAllComment", getAllCommentByStory)
router.delete("/:slug/:comment_id/delete", [getAccessToRoute, checkStoryExist], deleteComment)
router.post("/:comment_id/like", commentLike)
router.post("/:comment_id/getCommentLikeStatus", getCommentLikeStatus)

module.exports = router