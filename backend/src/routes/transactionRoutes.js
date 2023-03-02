const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const transactionController = require('../controllers/transactionController');
const transactionMiddleware = require('../middlewares/transactionMiddleware');

router.use(authMiddleware.validateUserLoggedIn);

router.post('/transactions', transactionMiddleware.validateTransactionBody, transactionController.createTransaction);
router.get('/transactions', transactionController.getTransactions);
router.put('/transactions/:id', transactionMiddleware.validateTransactionBody, transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

module.exports = router;