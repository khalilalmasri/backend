const mongoose = require("mongoose");
const joi = require("joi");

//post schema
const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// populate Comment for this post
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

//post Model

const Post = mongoose.model("Post", PostSchema);

//post validation
function validateCreatePost(post) {
  const schema = joi.object({
    title: joi.string().trim().min(2).max(100).required(),
    description: joi.string().trim().required(),
    category: joi.string().trim().required(),
  });
  return schema.validate(post);
}

//Update validation
function validateUpdatePost(post) {
    const schema = joi.object({
      title: joi.string().trim().min(2).max(100),
      description: joi.string().trim(),
      category: joi.string().trim(),
    });
    return schema.validate(post);
  }







module.exports = {Post, validateCreatePost, validateUpdatePost};
