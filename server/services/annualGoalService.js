const AnnualGoal = require('../model/annualGoal');

const AnnualGoalService = {
    // Get all annual goals for a user
    getAllGoals: async (userId) => {
        const goals = await AnnualGoal.find({ user: userId });
        return goals;
    },

    // Create a new annual goal
    createGoal: async (goalData) => {
        const goal = new AnnualGoal(goalData);
        return await goal.save();
    },

    // Update an annual goal
    updateGoal: async (goalId, userId, updateData) => {
        const goal = await AnnualGoal.findOneAndUpdate(
            { _id: goalId, user: userId },
            updateData,
            { new: true }
        );
        return goal;
    },

    // Delete an annual goal
    deleteGoal: async (goalId, userId) => {
        const goal = await AnnualGoal.findOneAndDelete({ _id: goalId, user: userId });
        return goal;
    },

    // Add funds to a goal
    addFunds: async (goalId, userId, amount) => {
        const goal = await AnnualGoal.findOne({ _id: goalId, user: userId });
        if (!goal) {
            throw new Error('Goal not found');
        }

        goal.current += amount;
        if (goal.current > goal.target) {
            goal.current = goal.target;
        }

        return await goal.save();
    }
};

module.exports = AnnualGoalService; 