const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contributionSchema = new Schema(
  {
    goalId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'goalModel'
    },
    goalModel: {
      type: String,
      required: true,
      enum: ['AnnualGoal', 'SavingsGoal']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: [true, "Contribution amount is required"],
      min: [0, "Contribution amount cannot be negative"]
    },
    source: {
      type: String,
      required: true,
      default: "salary",
      enum: ["salary", "manual"]
    },
    month: {
      type: String,
      required: true,
      // Format: YYYY-MM
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"]
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Ensure one contribution per goal per month per source
contributionSchema.index({ goalId: 1, month: 1, source: 1 }, { unique: true });

module.exports = mongoose.model("Contribution", contributionSchema);
