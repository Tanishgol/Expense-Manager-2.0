const express = require('express');
const router = express.Router();
const Transaction = require('../model/transaction');
const jwt = require('jsonwebtoken');
const { exportReport } = require('../controller/transactionExport');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Export transactions - must be before /:id route
router.get('/export', auth, async (req, res) => {
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
});

router.post('/', auth, async (req, res) => {
    try {
        const transaction = new Transaction({
            ...req.body,
            user: req.userId
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all transactions for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.userId })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific transaction
router.get('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.userId
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a transaction
router.patch('/:id', auth, async (req, res) => {
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
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 