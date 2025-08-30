const IncomeService = require('../services/incomeService');
const AnnualGoalService = require('../services/annualGoalService');
const SavingsGoalService = require('../services/savingsGoalService');

exports.getIncomeSummary = async (req, res) => {
    try {
        const { month } = req.query;
        const userId = req.userId;

        if (!month) {
            return res.status(400).json({ message: 'Month parameter is required (YYYY-MM format)' });
        }

        const summary = await IncomeService.getIncomeSummary(userId, month);
        res.json(summary);
    } catch (error) {
        console.error('Get income summary error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getCurrentMonthIncome = async (req, res) => {
    try {
        const userId = req.userId;
        const summary = await IncomeService.getCurrentMonthIncome(userId);
        res.json(summary);
    } catch (error) {
        console.error('Get current month income error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.hasCurrentMonthIncome = async (req, res) => {
    try {
        const userId = req.userId;
        const hasIncome = await IncomeService.hasCurrentMonthIncome(userId);
        res.json({ hasIncome });
    } catch (error) {
        console.error('Check current month income error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.createContribution = async (req, res) => {
    try {
        const { goalId, amount, month, goalType } = req.body;
        const userId = req.userId;

        if (!goalId || !amount || !month || !goalType) {
            return res.status(400).json({ 
                message: 'goalId, amount, month, and goalType are required' 
            });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: 'Amount must be greater than 0' });
        }

        const goalModel = goalType === 'annual' ? 'AnnualGoal' : 'SavingsGoal';

        // Create the contribution
        const contribution = await IncomeService.createContribution(
            userId, 
            goalId, 
            amount, 
            month, 
            goalModel
        );

        // Update the goal's current amount
        let updatedGoal;
        if (goalType === 'annual') {
            updatedGoal = await AnnualGoalService.addFunds(goalId, userId, amount);
        } else {
            updatedGoal = await SavingsGoalService.addFunds(goalId, userId, amount);
        }

        // Get updated income summary
        const incomeSummary = await IncomeService.getIncomeSummary(userId, month);

        res.json({
            contribution,
            updatedGoal,
            incomeSummary
        });
    } catch (error) {
        console.error('Create contribution error:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.getGoalContributions = async (req, res) => {
    try {
        const { goalId } = req.params;
        const userId = req.userId;

        const contributions = await IncomeService.getGoalContributions(userId, goalId);
        res.json(contributions);
    } catch (error) {
        console.error('Get goal contributions error:', error);
        res.status(500).json({ message: error.message });
    }
};
