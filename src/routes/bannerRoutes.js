const banner = require("../controllers/bannerControllers.js");
const {Router} = require('express');
const router = Router();

router.get('/banner', banner);

module.exports = router;
