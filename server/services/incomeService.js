const Transaction = require('../model/transaction');
const Contribution = require('../model/contribution');

const IncomeService = {
    // Get income summary for a specific month
    getIncomeSummary: async (userId, month) => {
        try {
            // Get all income transactions for the month
            const startDate = new Date(month + '-01');
            const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
            
            const incomeTransactions = await Transaction.find({
                user: userId,
                category: 'Income',
                amount: { $gt: 0 },
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            });

            const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

            // Get all contributions for the month
            const contributions = await Contribution.find({
                user: userId,
                month: month,
                source: 'salary'
            });

            const totalAllocated = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
            const available = totalIncome - totalAllocated;

            return {
                totalIncome,
                totalAllocated,
                available: Math.max(0, available),
                incomeTransactions,
                contributions
            };
        } catch (error) {
            console.error('Error getting income summary:', error);
            throw error;
        }
    },

    // Get current month's income summary
    getCurrentMonthIncome: async (userId) => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        return await IncomeService.getIncomeSummary(userId, currentMonth);
    },

    // Check if user has income for current month
    hasCurrentMonthIncome: async (userId) => {
        try {
            const summary = await IncomeService.getCurrentMonthIncome(userId);
            return summary.totalIncome > 0;
        } catch (error) {
            console.error('Error checking current month income:', error);
            return false;
        }
    },

    // Validate contribution amount
    validateContribution: async (userId, goalId, amount, month, goalModel) => {
        try {
            // Check available balance
            const summary = await IncomeService.getIncomeSummary(userId, month);
            if (amount > summary.available) {
                throw new Error(`Contribution amount exceeds available balance. Available: $${summary.available.toLocaleString()}`);
            }

            // Check for duplicate contribution
            const existingContribution = await Contribution.findOne({
                user: userId,
                goalId: goalId,
                month: month,
                source: 'salary'
            });

            if (existingContribution) {
                throw new Error('A salary contribution has already been made for this goal this month');
            }

            return true;
        } catch (error) {
            throw error;
        }
    },

    // Create a contribution
    createContribution: async (userId, goalId, amount, month, goalModel) => {
        try {
            // Validate the contribution
            await IncomeService.validateContribution(userId, goalId, amount, month, goalModel);

            const contribution = new Contribution({
                goalId,
                goalModel,
                user: userId,
                amount,
                source: 'salary',
                month
            });

            return await contribution.save();
        } catch (error) {
            console.error('Error creating contribution:', error);
            throw error;
        }
    },

    // Get contributions for a goal
    getGoalContributions: async (userId, goalId) => {
        try {
            return await Contribution.find({
                user: userId,
                goalId: goalId
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Error getting goal contributions:', error);
            throw error;
        }
    }
};

module.exports = IncomeService;
