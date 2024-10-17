const multer = require("multer");
const path = require("path");

// define accepted file type
const filetypes = /jpeg|jpg|png/;

// define file filter
const fileFilter = (req, file, cb) => {
  // test file type
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // check if the file type is supported
  if (!mimetype || !extname) {
    return cb(new multer.MulterError('LIMIT_UNSUPPORTED_FILETYPE', 'Format Image tidak sesuai'));
}
  // If everything is okay, accept the file
  cb(null, true);
};

// intiliaze multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

module.exports = upload;
