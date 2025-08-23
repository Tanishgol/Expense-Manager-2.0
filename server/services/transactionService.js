const Transaction = require('../model/transaction');

const TransactionService = {
    // Create a new transaction
    createTransaction: async (transactionData) => {
        const transaction = new Transaction(transactionData);
        return await transaction.save();
    },

    // Get all transactions for a user with pagination
    getAllTransactions: async (userId, page = 1, limit = 20, filters = {}) => {
        const skip = (page - 1) * limit;
        
        // Build query with filters
        const query = { user: userId };
        
        if (filters.category) {
            query.category = filters.category;
        }
        
        if (filters.startDate && filters.endDate) {
            query.date = {
                $gte: new Date(filters.startDate),
                $lte: new Date(filters.endDate)
            };
        }
        
        if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
            query.amount = {};
            if (filters.minAmount !== undefined) query.amount.$gte = filters.minAmount;
            if (filters.maxAmount !== undefined) query.amount.$lte = filters.maxAmount;
        }
        
        const transactions = await Transaction.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
            
        const total = await Transaction.countDocuments(query);
        
        return {
            transactions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
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