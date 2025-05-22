const TransactionService = require('../services/transactionService');

const TransactionController = {
    // Create a new transaction
    createTransaction: async (req, res) => {
        try {
            const transactionData = {
                ...req.body,
                user: req.userId
            };
            const transaction = await TransactionService.createTransaction(transactionData);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get all transactions for the authenticated user
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await TransactionService.getAllTransactions(req.userId);
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a specific transaction
    getTransactionById: async (req, res) => {
        try {
            const transaction = await TransactionService.getTransactionById(req.params.id, req.userId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a transaction
    updateTransaction: async (req, res) => {
        try {
            const transaction = await TransactionService.updateTransaction(
                req.params.id,
                req.userId,
                req.body
            );
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json(transaction);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete a transaction
    deleteTransaction: async (req, res) => {
        try {
            const transaction = await TransactionService.deleteTransaction(req.params.id, req.userId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found' });
            }
            res.json({ message: 'Transaction deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = TransactionController; 