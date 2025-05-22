const Transaction = require('../model/transaction');

const TransactionService = {
    // Create a new transaction
    createTransaction: async (transactionData) => {
        const transaction = new Transaction(transactionData);
        return await transaction.save();
    },

    // Get all transactions for a user
    getAllTransactions: async (userId) => {
        return await Transaction.find({ user: userId }).sort({ date: -1 });
    },

    // Get a specific transaction
    getTransactionById: async (transactionId, userId) => {
        return await Transaction.findOne({
            _id: transactionId,
            user: userId
        });
    },

    // Update a transaction
    updateTransaction: async (transactionId, userId, updateData) => {
        return await Transaction.findOneAndUpdate(
            { _id: transactionId, user: userId },
            updateData,
            { new: true }
        );
    },

    // Delete a transaction
    deleteTransaction: async (transactionId, userId) => {
        return await Transaction.findOneAndDelete({
            _id: transactionId,
            user: userId
        });
    }
};

module.exports = TransactionService; 