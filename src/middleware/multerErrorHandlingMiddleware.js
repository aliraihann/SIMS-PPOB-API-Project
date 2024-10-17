const multer = require("multer")

const multerErrorHandling = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        // error handling for expected error
        return res.status(400).json({
            status: 102,
            message: error.field,
            data: null,
        });
    } else if (error) {
        // An unknown error occurred
        console.log(error);
        return res.status(500).json({
            status: 108,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
    next();
};

module.exports = multerErrorHandling;
