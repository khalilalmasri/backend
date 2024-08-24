const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../model/Category");

/**----------------------------------------------
* @description  Create new Category
* @route /api/categories
* @method POST
* @access private (only Admin)
------------------------------------------------*/

module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
  });
  res.status(201).json(category);
});

/**----------------------------------------------
* @description  Get all Categories
* @route /api/categories
* @method GET
* @access puplic 
------------------------------------------------*/

module.exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});
/**----------------------------------------------
* @description  Delete Category
* @route /api/categories/:id
* @method DELETE
* @access private (only Admin)
------------------------------------------------*/

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }
  await Category.findByIdAndDelete(req.params.id);
  res.status(200).json({
    message: "Category deleted successfully",
    categoryId: category._id,
  });
});
