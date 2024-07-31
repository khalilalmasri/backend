const router = require("express").Router();
const { registerUserCtrl } = require("../controllers/authController");



router.post("/register", registerUserCtrl);

module.exports = router