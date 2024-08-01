const asyncHandler = require("express-async-handler");
const { User, validateRegisterUser , validateLoginUser} = require("../model/User");
const bcrypt = require("bcrypt");
/**
 * @description Register a new user
 * @route /api/auth/register
 * @method POST
 * @access public
 */
const registerUserCtrl = asyncHandler(async (req, res) => {
  // validation
  // is user already exist
  // hash password
  // create user
  // send response
  const { error } = validateRegisterUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  await user.save();

    //to do  sending email

  res.status(201).json({ message: "User created successfully" });
});
/**
 * @description login  user
 * @route /api/auth/login
 * @method POST
 * @access public
 */

  const loginUserCtrl = asyncHandler(async(req,res)=>{
    // validation
    // is user exist
    // check password
    // generate token (jwt)
    // response to client
    const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid email or password" });
  }
  //to do  sending email
  const token = user.generateAuthToken(); 
  res.status(200).json({
    message: "Login successful",
    _id : user._id,
    token: token,
    username: user.username,
    email: user.email,
    profilephoto: user.profilephoto,
    bio: user.bio,
    isAdmin: user.isAdmin,
    isAcoountVerified: user.isAcoountVerified,

  }

  )});
module.exports = { registerUserCtrl  , loginUserCtrl  };
