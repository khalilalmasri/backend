const path = require("path");
const multer = require("multer");

//photo storage
const photostorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: function (req, file, cb) {
    if (file) {
      // cb(null, file.originalname);}
      cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
    } else {
      cb(null, false);
    }
  },
});

//photo Upload middleware
const photoupload = multer({ storage: photostorage , fileFilter: function (req, file, cb)  {
//   if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    // cb(null, false);return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    cb({message: "Only .png, .jpg and .jpeg format allowed!"}, false);
  }
} , limits: { fileSize: 1024 * 1024 * 5 } // 5MB
 });

 module.exports = photoupload