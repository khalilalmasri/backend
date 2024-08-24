const mongoose = require("mongoose");
const joi = require("joi");

const CategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// category model
const Category = mongoose.model("Category", CategorySchema);

// validate create Category
function validateCreateCategory(category) {
  const schema = joi.object({
    title: joi.string().trim().required().label("title"),
  });
  return schema.validate(category);
}

module.exports = { Category, validateCreateCategory };
