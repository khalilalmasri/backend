const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { Post, validateCreatePost } = require("../model/Post");
const {cloudinaryUploadImg, cloudinaryRemoveImg} = require("../utils/cloudinary");

/**----------------------------------------------
* @description  Create new Post
* @route /api/posts
* @method POST
* @access private (only logged in user)
------------------------------------------------*/


module.exports.createPostCtrl = asyncHandler(async (req, res) => {
    // 1 . validation for image
    if (!req.file) {
        return res.status(400).json({ message: "File not found no image provided" });
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
    })

    // 5 . send response to the client
    res.status(200).json({
        message: "Post created successfully",
        post: newPost,
    });
    // 6 . remove old image from the server
    fs.unlinkSync(imagePath);
    
});
