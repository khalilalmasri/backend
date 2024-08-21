const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../model/comment");
const { User } = require("../model/User");
const { Post } = require("../model/Post");

/**----------------------------------------------
* @description  Create new Comment
* @route /api/comments
* @method POST
* @access private (only logged in user)
------------------------------------------------*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const profile = await User.findById(req.user.id);
  const comment = await Comment.create({
    postId: req.body.postId,
    user: req.user.id,
    text: req.body.text,
    username: profile.username,
  });
  res.status(201).json(comment);
});
/**----------------------------------------------
* @description  get all Comment
* @route /api/comments
* @method GET
* @access private (only admin)
------------------------------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user", ["-password"]);
  res.status(200).json({ comments });
});
/**----------------------------------------------
* @description  Delete Comment
* @route /api/comments/:id
* @method DELETE
* @access private (only admin or owner of the comment)
------------------------------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Comment deleted successfully",
      commentId: comment._id,
    });
  } else {
    return res.status(403).json({ message: "Not authorized" });
  }
});
