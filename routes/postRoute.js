const router = require("express").Router();
const {
  createPostCtrl,
  getAllPostsCtrl,
  getSinglePostsCtrl,
  getPostsCountCtrl,
} = require("../controllers/postController");
const photoupload = require("../middlewares/PhotoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken } = require("../middlewares/verifyToken");

// /api/posts
router
  .route("/")
  .post(verifyToken, photoupload.single("image"), createPostCtrl)
  .get(getAllPostsCtrl);

// /api/posts/count
router.route("/count").get(getPostsCountCtrl);

// /api/posts/:id
router.route("/:id").get(validateObjectId, getSinglePostsCtrl);

module.exports = router;
