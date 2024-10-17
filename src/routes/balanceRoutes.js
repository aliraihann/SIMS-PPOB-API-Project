const balance = require('../controllers/balanceControllers.js');
const authentication = require("../middleware/authMiddleware.js");
const {Router} = require('express');
const router = Router();

router.get('/balance', authentication, balance);

module.exports = router;