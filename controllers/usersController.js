const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../model/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const {
  cloudinaryUploadImg,
  cloudinaryRemoveImg,
} = require("../utils/cloudinary");

/**
 * @description get all users profile
 * @route /api/auth/profile
 * @method GET
 * @access private (only admin)
 */

const getAllUsersCtrl = asyncHandler(async (req, res) => {
  // console.log("req.headers.authorization", req.headers.authorization.split(" ")[1]);
  const users = await User.find().select("-password").populate("posts");

  res.status(200).json({ users });
});

/**
 * @description get user profile
 * @route /api/auth/profile/:id
 * @method GET
 * @access puplic
 */

const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").populate(
    "posts",
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(user);
});

/**
 * @description update user profile
 * @route /api/auth/profile/:id
 * @method PUT
 * @access private (only user himself)
 */

const updateUserProfileCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    $set: {
      username: req.body.username,
      password: req.body.password,
      bio: req.body.bio,
    },
    new: true,
  }).select("-password");
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json(updatedUser);
});
/**
 * @description get  users Count
 * @route /api/users/count
 * @method GET
 * @access private (only admin)
 */

const getUsersCountCtrl = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});

/**
 * @description  profile photo upload
 * @route /api/user/profile/profile-photo-upload
 * @method POST
 * @access private (only logged in user)
 */

const profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
  //1 - VALIDATION
  // console.log(req.file)
  if (!req.file) {
    return res.status(400).json({ message: "File not found" });
  }

  // 2 -GET the path to the file
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
  // 3 - upload to cloudinary
  const result = await cloudinaryUploadImg(imagePath);
  // console.log(result);
  // 4 - get the user from DB
  const user = await User.findById(req.user.id);
  // 5 - Delete the old photo if exists
  if (user.profilephoto.publicId !== null) {
    await cloudinaryRemoveImg(user.profilephoto.publicId);

    // console.log(user);
  }
  // 6 - update the user in the DB
  user.profilephoto = {
    publicId: result.publicId,
    url: result.secure_url,
  };
  await user.save();
  // 7 - send response to client
  res.status(200).json({
    message: "Profile photo uploaded successfully",
    profilePhoto: {
      url: result.secure_url,
      publicId: result.publicId,
    },
  });
  // 8 - remove old photo from the server
  fs.unlinkSync(imagePath);
});

/**
 * @description  delete user profile (account)
 * @route /api/user/profile/:id
 * @method DELETE
 * @access private (only admin or user himself)
 */

const deleteUserProfileCtrl = asyncHandler(async (req, res) => {
  //1.get user from DB
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  ////...........................to do.................................................
  //2.get all posts from DB
  //3.get the public ids from the posts
  //4.delete all posts images from cloudinary that belong to the user
  //......................................................
  //5.delete the profile photo from cloudinary
  await cloudinaryRemoveImg(user.profilephoto.publicId);

  //...............to do............................................................
  //6.delete user posts & comments 
  //.................
  //7.delete the user himself
  await User.findByIdAndDelete(req.params.id);
  //8.send response to client
  res.status(200).json({ message: "User deleted successfully" });
  
 
});

module.exports = {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
};
