const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ['Food', 'Housing', 'Transportation', 'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Personal Care', 'Other']
        },
        limit: {
            type: Number,
            required: [true, "Budget limit is required"],
            min: [0, "Budget limit cannot be negative"]
        },
        spent: {
            type: Number,
            default: 0,
            min: [0, "Spent amount cannot be negative"]
        },
        color: {
            type: String,
            default: 'bg-blue-500'
        },
        type: {
            type: String,
            enum: ['monthly', 'annual', 'savings'],
            default: 'monthly'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date
        }
    },
    { timestamps: true }
);

// Virtual for calculating percentage
budgetSchema.virtual('percentage').get(function() {
    return (this.spent / this.limit) * 100;
});

// Ensure virtuals are included when converting to JSON
budgetSchema.set('toJSON', { virtuals: true });
budgetSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Budget", budgetSchema); 