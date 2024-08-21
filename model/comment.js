const mongoose = require("mongoose");
const joi = require("joi");

const CommentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },

} , { timestamps: true });

// comment model
const Comment = mongoose.model("Comment", CommentSchema);

// validate create comment
function validateCreateComment(comment) {
  const schema = joi.object({
    postId: joi.string().required(),
    text: joi.string().trim().required(),
  });
  return schema.validate(comment);
}

// validate update comment
function validateUpdateComment(comment) {
    const schema = joi.object({
      text: joi.string().trim().required().label("Post_ID"),
    });
    return schema.validate(comment);
  }

  module.exports = { Comment, validateCreateComment, validateUpdateComment };