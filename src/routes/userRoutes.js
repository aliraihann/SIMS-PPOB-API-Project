const {
  register,
  login,
  profile,
  updateProfile,
  updateProfileImage,
} = require("../controllers/userControllers.js");
const upload = require("../middleware/multerMiddleware.js");
const multerErrorHandling = require("../middleware/multerErrorHandlingMiddleware.js");
const authentication = require("../middleware/authMiddleware.js");
const { Router } = require("express");
const router = Router();

router.post("/registration", register);
router.post("/login", login);
router.get("/profile", authentication, profile);
router.post("/profile/update", authentication, updateProfile);
router.post(
  "/profile/image",
  authentication,
  upload.single("file"),
  updateProfileImage,
  multerErrorHandling
);

module.exports = router;
