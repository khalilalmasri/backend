const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//cloudinary upload image
const cloudinaryUploadImg = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    return error;
  }
};



//cloudinary Remove image
const cloudinaryRemoveImg = async (imagePublicId) => {
    try {
      const result = await cloudinary.uploader.destroy(imagePublicId);
      return result;
    } catch (error) {
      return error;
    }
  };

  module.exports = { cloudinaryUploadImg, cloudinaryRemoveImg };
