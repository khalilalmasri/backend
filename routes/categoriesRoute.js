const router = require("express").Router();
const validateObjectId = require("../middlewares/validateObjectId");
const {
  createCategoryCtrl,
  getAllCategories,
  deleteCategoryCtrl,
} = require("../controllers/ctegoriesController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// /api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin, createCategoryCtrl)
  .get(getAllCategories);

// /api/categories/:id
router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategoryCtrl);

module.exports = router;
