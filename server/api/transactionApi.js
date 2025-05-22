const express = require('express');
const router = express.Router();
const TransactionController = require('../controller/transactionController');
const auth = require('../middleware/auth');

// Transaction routes
router.post('/', auth, TransactionController.createTransaction);
router.get('/', auth, TransactionController.getAllTransactions);
router.get('/:id', auth, TransactionController.getTransactionById);
router.patch('/:id', auth, TransactionController.updateTransaction);
router.delete('/:id', auth, TransactionController.deleteTransaction);

module.exports = router; 