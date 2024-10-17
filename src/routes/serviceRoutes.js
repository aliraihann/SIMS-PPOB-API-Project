const service = require('../controllers/serviceControllers.js');
const authentication = require("../middleware/authMiddleware.js");
const {Router} = require('express');
const router = Router();

router.get('/services', authentication, service);

module.exports = router;