const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Budget = require('../model/budget');
const TotalBudget = require('../model/totalBudget');

// Get all budgets for a user
const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get total budget
const getTotalBudget = async (req, res) => {
    try {
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const totalBudget = await TotalBudget.findOne({
            user: req.userId,
            month,
            year
        });

        res.json(totalBudget || { amount: 0 });
    } catch (error) {
        console.error('Error fetching total budget:', error);
        res.status(500).json({ message: 'Failed to fetch total budget' });
    }
};

// Set total budget
const setTotalBudget = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount < 0) {
            return res.status(400).json({ message: 'Invalid budget amount' });
        }

        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const totalBudget = await TotalBudget.findOneAndUpdate(
            {
                user: req.userId,
                month,
                year
            },
            {
                amount,
                user: req.userId,
                month,
                year
            },
            {
                new: true,
                upsert: true
            }
        );

        res.json(totalBudget);
    } catch (error) {
        console.error('Error setting total budget:', error);
        res.status(500).json({ message: 'Failed to set total budget' });
    }
};

// Create a new budget
const createBudget = async (req, res) => {
    try {
        const budget = new Budget({
            ...req.body,
            user: req.userId
        });
        const savedBudget = await budget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a budget
const updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            req.body,
            { new: true }
        );
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a budget
const deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.json({ message: 'Budget deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get budget summary
const getBudgetSummary = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Define routes
router.get('/', verifyToken, getAllBudgets);
router.post('/', verifyToken, createBudget);
router.put('/:id', verifyToken, updateBudget);
router.delete('/:id', verifyToken, deleteBudget);
router.get('/summary', verifyToken, getBudgetSummary);
router.get('/total', verifyToken, getTotalBudget);
router.post('/total', verifyToken, setTotalBudget);

module.exports = router; 