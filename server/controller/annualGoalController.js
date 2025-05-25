const AnnualGoalService = require('../services/annualGoalService');

const AnnualGoalController = {
    // Get all annual goals for the authenticated user
    getAllGoals: async (req, res) => {
        try {
            const goals = await AnnualGoalService.getAllGoals(req.userId);
            res.json(goals);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create a new annual goal
    createGoal: async (req, res) => {
        try {
            const goalData = {
                ...req.body,
                user: req.userId
            };
            const goal = await AnnualGoalService.createGoal(goalData);
            res.status(201).json(goal);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update an annual goal
    updateGoal: async (req, res) => {
        try {
            const goal = await AnnualGoalService.updateGoal(
                req.params.id,
                req.userId,
                req.body
            );
            if (!goal) {
                return res.status(404).json({ message: 'Goal not found' });
            }
            res.json(goal);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete an annual goal
    deleteGoal: async (req, res) => {
        try {
            const goal = await AnnualGoalService.deleteGoal(req.params.id, req.userId);
            if (!goal) {
                return res.status(404).json({ message: 'Goal not found' });
            }
            res.json({ message: 'Goal deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Add funds to a goal
    addFunds: async (req, res) => {
        try {
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({ message: 'Invalid amount' });
            }

            const goal = await AnnualGoalService.addFunds(req.params.id, req.userId, amount);
            if (!goal) {
                return res.status(404).json({ message: 'Goal not found' });
            }
            res.json(goal);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = AnnualGoalController; 