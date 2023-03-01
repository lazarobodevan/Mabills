const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transactionController');

router.use(authMiddleware.validateUserLoggedIn);

router.post('/transactions', transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);

module.exports = router;