const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const Budget = require('../model/budget');

// Get all budgets for a user
const getAllBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.userId });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
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

module.exports = router; 