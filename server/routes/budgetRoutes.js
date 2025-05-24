const express = require('express');
const router = express.Router();
const BudgetController = require('../controller/budgetController');
const authenticateToken = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Create a new budget
router.post('/', BudgetController.createBudget);

// Get all budgets
router.get('/', BudgetController.getAllBudgets);

// Get budget summary
router.get('/summary', BudgetController.getBudgetSummary);

// Get a specific budget
router.get('/:id', BudgetController.getBudgetById);

// Update a budget
router.put('/:id', BudgetController.updateBudget);

// Delete a budget
router.delete('/:id', BudgetController.deleteBudget);

module.exports = router; 