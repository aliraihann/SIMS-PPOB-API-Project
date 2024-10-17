const {topUp, transaction, transactionHistory } = require("../controllers/transactionControllers.js");
const authentication = require("../middleware/authMiddleware.js");
const {Router} = require('express');
const router = Router();

router.post('/topup', authentication, topUp);
router.post('/transaction', authentication, transaction);
router.get('/transaction/history', authentication, transactionHistory);

module.exports = router;
