const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { Post, validateCreatePost } = require("../model/Post");
const {
  cloudinaryUploadImg,
  cloudinaryRemoveImg,
} = require("../utils/cloudinary");

/**----------------------------------------------
* @description  Create new Post
* @route /api/posts
* @method POST
* @access private (only logged in user)
------------------------------------------------*/

module.exports.createPostCtrl = asyncHandler(async (req, res) => {
  // 1 . validation for image
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "File not found no image provided" });
  }
  // 2 . validation for data
  const { error } = validateCreatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // 3 . upload image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  const result = await cloudinaryUploadImg(imagePath);
  // 4 . create post and save it in db
  // ******this way
  // const newPost = new Post({
  //     title: req.body.title,
  // });
  // await newPost.save();

  //*****another way
  const newPost = await Post.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    user: req.user.id,
  });

  // 5 . send response to the client
  res.status(200).json({
    message: "Post created successfully",
    post: newPost,
  });
  // 6 . remove old image from the server
  fs.unlinkSync(imagePath);
});

/**----------------------------------------------
* @description  Get all Post
* @route /api/posts
* @method Get
* @access public 
------------------------------------------------*/
module.exports.getAllPostsCtrl = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 3;
  const { pageNumper, category } = req.query;
  let posts;
  if (pageNumper) {
    posts = await Post.find()
      .skip((pageNumper - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE)
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else if (category) {
    posts = await Post.find({ category })
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  } else {
    posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", ["-password"]);
  }
  res.status(200).json({ posts });
});

/**----------------------------------------------
* @description  Get single Post
* @route /api/posts/:id
* @method GET
* @access public 
------------------------------------------------*/
module.exports.getSinglePostsCtrl = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("user", [
    "-password",
  ]);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  res.status(200).json(post);
});

/**----------------------------------------------
* @description  Get posts Count
* @route /api/posts/count
* @method GET
* @access public 
------------------------------------------------*/
module.exports.getPostsCountCtrl = asyncHandler(async (req, res) => {
    const count = await Post.countDocuments();
    res.status(200).json(count);
  });