const TotalBudget = require('../model/totalBudget');

const TotalBudgetService = {
    // Get total budget for a user
    getTotalBudget: async (userId, type = 'monthly') => {
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const totalBudget = await TotalBudget.findOne({
            user: userId,
            type,
            month,
            year
        });

        return totalBudget;
    },

    // Set or update total budget
    setTotalBudget: async (userId, amount, type = 'monthly') => {
        const currentDate = new Date();
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();

        const totalBudget = await TotalBudget.findOneAndUpdate(
            {
                user: userId,
                type,
                month,
                year
            },
            {
                amount,
                user: userId,
                type,
                month,
                year
            },
            {
                new: true,
                upsert: true
            }
        );

        return totalBudget;
    }
};

module.exports = TotalBudgetService; 