const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
      type: {
        type: String,
        required: true,
        default: ["income", "expense"],
      },
        category: {
            type: String,
            required: true,
           default: "Uncategorized",
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {  // Add this field for multi-currency support
            type: String,
            required: true,
            default: "USD",  // Default currency
        },
        date: {
            type: Date,
            default: Date.now,
        },
        description:{
            type: String,
            required: false,
        },
        tags: { // Add tags field for custom labels
            type: [String],
            default: [],
        },
        recurring: { // Add recurring field for recurring transactions
            type: {
                pattern: {
                    type: String,
                    enum: ["daily", "weekly", "monthly", "yearly"],
                },
                endDate: Date,
            },
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);
