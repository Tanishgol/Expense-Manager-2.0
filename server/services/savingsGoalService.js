const SavingsGoal = require('../model/savingsGoal');

const SavingsGoalService = {
    // Get all savings goals for a user
    getAllGoals: async (userId) => {
        const goals = await SavingsGoal.find({ user: userId });
        return goals;
    },

    // Get active savings goals for a user
    getActiveGoals: async (userId) => {
        const goals = await SavingsGoal.find({ user: userId, isActive: true });
        return goals;
    },

    // Create a new savings goal
    createGoal: async (goalData) => {
        const goal = new SavingsGoal(goalData);
        return await goal.save();
    },

    // Update a savings goal
    updateGoal: async (goalId, userId, updateData) => {
        const goal = await SavingsGoal.findOneAndUpdate(
            { _id: goalId, user: userId },
            updateData,
            { new: true }
        );
        return goal;
    },

    // Delete a savings goal
    deleteGoal: async (goalId, userId) => {
        const goal = await SavingsGoal.findOneAndDelete({ _id: goalId, user: userId });
        return goal;
    },

    // Add funds to a savings goal
    addFunds: async (goalId, userId, amount) => {
        const goal = await SavingsGoal.findOne({ _id: goalId, user: userId });
        if (!goal) {
            throw new Error('Goal not found');
        }

        goal.current += amount;
        if (goal.current > goal.targetAmount) {
            goal.current = goal.targetAmount;
        }

        return await goal.save();
    },

    // Toggle goal active status
    toggleGoalStatus: async (goalId, userId) => {
        const goal = await SavingsGoal.findOne({ _id: goalId, user: userId });
        if (!goal) {
            throw new Error('Goal not found');
        }

        goal.isActive = !goal.isActive;
        return await goal.save();
    }
};

module.exports = SavingsGoalService;
