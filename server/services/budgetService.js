const Budget = require('../model/budget');
const Transaction = require('../model/transaction');
const mongoose = require('mongoose');

const BudgetService = {
    // Create a new budget
    createBudget: async (budgetData) => {
        // Check if budget already exists for this category and user
        const existingBudget = await Budget.findOne({
            user: budgetData.user,
            category: budgetData.category,
            type: budgetData.type
        });

        if (existingBudget) {
            throw new Error('A budget for this category already exists');
        }

        const budget = new Budget(budgetData);
        return await budget.save();
    },

    // Get all budgets for a user
    getAllBudgets: async (userId, type = 'monthly') => {
        const budgets = await Budget.find({ user: userId, type });
        
        // Calculate spent amount from transactions for each budget
        for (let budget of budgets) {
            const spent = await Transaction.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        category: budget.category,
                        amount: { $lt: 0 }, // Only expenses
                        date: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $abs: '$amount' } }
                    }
                }
            ]);

            budget.spent = spent.length > 0 ? spent[0].total : 0;
            await budget.save();
        }

        return budgets;
    },

    // Get a specific budget
    getBudgetById: async (budgetId, userId) => {
        const budget = await Budget.findOne({ _id: budgetId, user: userId });
        if (!budget) return null;

        // Calculate spent amount from transactions
        const spent = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId),
                    category: budget.category,
                    amount: { $lt: 0 }, // Only expenses
                    date: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $abs: '$amount' } }
                }
            }
        ]);

        budget.spent = spent.length > 0 ? spent[0].total : 0;
        await budget.save();

        return budget;
    },

    // Update a budget
    updateBudget: async (budgetId, userId, updateData) => {
        const budget = await Budget.findOneAndUpdate(
            { _id: budgetId, user: userId },
            updateData,
            { new: true }
        );
        return budget;
    },

    // Delete a budget
    deleteBudget: async (budgetId, userId) => {
        // First check if the budget exists and belongs to the user
        const budget = await Budget.findOne({ _id: budgetId, user: userId });
        
        if (!budget) {
            throw new Error('Budget not found');
        }

        // Check if there are any transactions associated with this budget category
        const hasTransactions = await Transaction.exists({
            user: userId,
            category: budget.category,
            date: {
                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
            }
        });

        if (hasTransactions) {
            throw new Error('Cannot delete budget with existing transactions');
        }

        // If all checks pass, delete the budget
        const deletedBudget = await Budget.findOneAndDelete({ _id: budgetId, user: userId });
        
        if (!deletedBudget) {
            throw new Error('Failed to delete budget');
        }

        return deletedBudget;
    },

    // Get budget summary for a user
    getBudgetSummary: async (userId) => {
        // First, clean up any duplicate budgets
        await BudgetService.cleanupDuplicateBudgets(userId);
        
        const budgets = await Budget.find({ user: userId, type: 'monthly' });
        
        // Calculate spent amount from transactions for each budget
        for (let budget of budgets) {
            const spent = await Transaction.aggregate([
                {
                    $match: {
                        user: new mongoose.Types.ObjectId(userId),
                        category: budget.category,
                        amount: { $lt: 0 }, // Only expenses
                        date: {
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                        }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: { $abs: '$amount' } }
                    }
                }
            ]);

            budget.spent = spent.length > 0 ? spent[0].total : 0;
            await budget.save();
        }

        return budgets;
    },

    // Clean up duplicate budgets
    cleanupDuplicateBudgets: async (userId) => {
        const budgets = await Budget.find({ user: userId, type: 'monthly' });
        const categories = new Set();
        const duplicates = [];

        // Find duplicate categories
        budgets.forEach(budget => {
            if (categories.has(budget.category)) {
                duplicates.push(budget);
            } else {
                categories.add(budget.category);
            }
        });

        // Delete duplicate budgets
        for (const duplicate of duplicates) {
            await Budget.findByIdAndDelete(duplicate._id);
        }

        return duplicates.length;
    },

    // Check if budget exists for a category
    checkBudgetExists: async (userId, category) => {
        const budget = await Budget.findOne({
            user: userId,
            category: category,
            type: 'monthly'
        });
        return !!budget;
    }
};

module.exports = BudgetService; 