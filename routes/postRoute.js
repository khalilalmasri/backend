const router = require("express").Router();
const { createPostCtrl } = require("../controllers/postController");
const photoupload = require("../middlewares/PhotoUpload");
const {verifyToken} = require("../middlewares/verifyToken");


// /api/posts
router.route("/").post(verifyToken, photoupload.single("image"),createPostCtrl);


module.exports = router