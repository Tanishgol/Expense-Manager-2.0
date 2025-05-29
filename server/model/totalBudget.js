const mongoose = require('mongoose');

const totalBudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    month: {
        type: Number,
        required: true,
        min: 0,
        max: 11
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create a compound index to ensure only one total budget per user per month
totalBudgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

const TotalBudget = mongoose.model('TotalBudget', totalBudgetSchema);

module.exports = TotalBudget; 