const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const annualGoalSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        title: {
            type: String,
            required: [true, "Title is required"]
        },
        category: {
            type: String,
            required: [true, "Category is required"]
        },
        target: {
            type: Number,
            required: [true, "Target amount is required"],
            min: [0, "Target amount cannot be negative"]
        },
        current: {
            type: Number,
            default: 0,
            min: [0, "Current amount cannot be negative"]
        },
        deadline: {
            type: Date,
            required: [true, "Deadline is required"]
        },
        description: {
            type: String
        }
    },
    { timestamps: true }
);

// Virtual for calculating progress
annualGoalSchema.virtual('progress').get(function() {
    return (this.current / this.target) * 100;
});

module.exports = mongoose.model("AnnualGoal", annualGoalSchema); 