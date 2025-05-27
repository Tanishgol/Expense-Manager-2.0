const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
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

module.exports = mongoose.model("Transaction", transactionSchema);
