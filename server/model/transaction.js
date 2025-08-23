const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "registerusers",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [-999999999, "Amount cannot be less than -999,999,999"],
      max: [999999999, "Amount cannot exceed 999,999,999"],
      validate: {
        validator: function(value) {
          return value !== 0; // Prevent zero amounts
        },
        message: "Amount cannot be zero"
      }
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
      validate: {
        validator: function(value) {
          const now = new Date();
          const maxFutureDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
          return value <= maxFutureDate;
        },
        message: "Date cannot be more than 1 year in the future"
      }
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Housing",
        "Transportation",
        "Utilities",
        "Healthcare",
        "Entertainment",
        "Shopping",
        "Personal Care",
        "Other",
        "Income"
      ],
    },
    vendor: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Add indexes for better performance
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
