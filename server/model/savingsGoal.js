const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingsGoalSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, "Goal name is required"]
    },
    description: {
      type: String
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"]
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"]
    },
    targetAmount: {
      type: Number,
      required: [true, "Target amount is required"],
      min: [0, "Target amount cannot be negative"]
    },
    current: {
      type: Number,
      default: 0,
      min: [0, "Current amount cannot be negative"]
    },
    monthlyContribution: {
      type: Number,
      required: [true, "Monthly contribution is required"],
      min: [0, "Monthly contribution cannot be negative"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
