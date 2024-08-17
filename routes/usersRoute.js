const router = require("express").Router();
const {
  getAllUsersCtrl,
  getUserProfileCtrl,
  updateUserProfileCtrl,
  getUsersCountCtrl,
  profilePhotoUploadCtrl,
  deleteUserProfileCtrl,
} = require("../controllers/usersController");
const photoupload = require("../middlewares/PhotoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlySameUser,
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

//api/users/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl);
//api/users/profile/:id

router
  .route("/profile/:id")
  .get(validateObjectId, getUserProfileCtrl)
  .put(validateObjectId, verifyTokenAndOnlySameUser, updateUserProfileCtrl)
  .delete(validateObjectId, verifyTokenAndAuthorization , deleteUserProfileCtrl);

router
  .route("/profile/profile-photo-upload")
  .post(verifyToken, photoupload.single("image"), profilePhotoUploadCtrl);

router.route("/count").get(verifyTokenAndAdmin, getUsersCountCtrl);

module.exports = router;
