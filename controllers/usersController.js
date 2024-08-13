const asyncHandler = require("express-async-handler");
const { User } = require("../model/User");

/**
 * @description get all users profile
 * @route /api/auth/profile
 * @method GET
 * @access private (only admin)
 */

const getAllUsersCtrl = asyncHandler(async (req, res) => {
  // console.log("req.headers.authorization", req.headers.authorization.split(" ")[1]);
  const users = await User.find();

  res.status(200).json({ users });
});

module.exports = { getAllUsersCtrl };
