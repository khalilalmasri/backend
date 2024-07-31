const asyncHandler = require("express-async-handler");
const { User, validateRegisterUser } = require("../model/User");
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

  res.status(201).json({ message: "User created successfully" });
});

module.exports = { registerUserCtrl };
