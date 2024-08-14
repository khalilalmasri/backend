const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
} = require("../controllers/usersController");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlySameUser,
} = require("../middlewares/verifyToken");

//api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);
//api/users/profile/:id
router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlySameUser, updateUserProfileCtrl);

router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

module.exports = router;
