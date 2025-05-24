const BudgetService = require('../services/budgetService');

const BudgetController = {
    // Create a new budget
    createBudget: async (req, res) => {
        try {
            const budgetData = {
                ...req.body,
                user: req.userId
            };
            const budget = await BudgetService.createBudget(budgetData);
            res.status(201).json(budget);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get all budgets for the authenticated user
    getAllBudgets: async (req, res) => {
        try {
            const type = req.query.type || 'monthly';
            const budgets = await BudgetService.getAllBudgets(req.userId, type);
            res.json(budgets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get a specific budget
    getBudgetById: async (req, res) => {
        try {
            const budget = await BudgetService.getBudgetById(req.params.id, req.userId);
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }
            res.json(budget);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update a budget
    updateBudget: async (req, res) => {
        try {
            const budget = await BudgetService.updateBudget(
                req.params.id,
                req.userId,
                req.body
            );
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }
            res.json(budget);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete a budget
    deleteBudget: async (req, res) => {
        try {
            const budget = await BudgetService.deleteBudget(req.params.id, req.userId);
            if (!budget) {
                return res.status(404).json({ message: 'Budget not found' });
            }
            res.json({ message: 'Budget deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get budget summary
    getBudgetSummary: async (req, res) => {
        try {
            const budgets = await BudgetService.getBudgetSummary(req.userId);
            res.json(budgets);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = BudgetController; 