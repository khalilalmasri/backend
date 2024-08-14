const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlengh: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlengh: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilephoto: {
      type: Object,
      default: {
        url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        publicId: null,
      },
    },
    bio: { type: String },
    isAdmin: { type: Boolean, default: false },
    isAcoountVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Generate token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "500d",
    }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

function validateRegisterUser(user) {
  const schema = joi.object({
    username: joi.string().min(3).max(100).required(),
    email: joi.string().min(5).max(100).required().email(),
    password: joi.string().min(8).required(),
    profilephoto: joi.object(),
    bio: joi.string(),
    isAdmin: joi.boolean(),
    isAcoountVerified: joi.boolean(),
  });
  return schema.validate(user);
}

function validateLoginUser(user) {
  const schema = joi.object({
    email: joi.string().min(5).max(100).required().email(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(user);
}
function validateUpdateUser(user) {
  const schema = joi.object({
    username: joi.string().trim().min(3).max(100).required(),
    password: joi.string().trim().min(8),
    bio: joi.string(),
  });
  return schema.validate(user);
}
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
};
