const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../model/User");
const bcrypt = require("bcrypt");

/**
 * @description get all users profile
 * @route /api/auth/profile
 * @method GET
 * @access private (only admin)
 */

const getAllUsersCtrl = asyncHandler(async (req, res) => {
  // console.log("req.headers.authorization", req.headers.authorization.split(" ")[1]);
  const users = await User.find().select("-password");

  res.status(200).json({ users });
});

/**
 * @description get users profile
 * @route /api/auth/profile/:id
 * @method GET
 * @access puplic
 */

const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
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
  // console.log(req.file)
  if (!req.file) {
    return res.status(400).json({ message: "File not found" });
  }
  res.status(200).json({
    message: "Profile photo uploaded successfully",
  });
});

module.exports = {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
};
