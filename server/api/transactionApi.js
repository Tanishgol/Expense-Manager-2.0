const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const Transaction = require("../model/transaction");
const { exportReport } = require("../controller/transactionExport");

// Get all transactions for a user
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.userId })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new transaction
const createTransaction = async (req, res) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            user: req.userId
        });
        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a transaction
const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a transaction
const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get transaction statistics
const getTransactionStats = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            {
                $match: {
                    user: req.userId
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export transactions
const exportTransactions = async (req, res) => {
    try {
        const format = req.query.format || 'csv';
        const transactions = await Transaction.find({ user: req.userId })
            .sort({ date: -1 });

        // Calculate summary
        const totalIncome = transactions
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const netSavings = totalIncome - totalExpenses;
        const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

        // Find top expense category
        const expensesByCategory = transactions
            .filter(t => t.amount < 0)
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
                return acc;
            }, {});

        const topExpenseCategory = Object.entries(expensesByCategory)
            .reduce((max, [category, amount]) => 
                amount > max.amount ? { category, amount } : max,
                { category: '', amount: 0 }
            );

        const summary = {
            totalIncome,
            totalExpenses,
            netSavings,
            savingsRate,
            topExpenseCategory
        };

        await exportReport(req, res, { format, transactions, summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Define routes
router.get('/', verifyToken, getAllTransactions);
router.post('/', verifyToken, createTransaction);
router.put('/:id', verifyToken, updateTransaction);
router.delete('/:id', verifyToken, deleteTransaction);
router.get('/stats', verifyToken, getTransactionStats);
router.get('/export', verifyToken, exportTransactions);

module.exports = router;
