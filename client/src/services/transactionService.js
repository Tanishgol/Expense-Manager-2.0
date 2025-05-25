import axios from 'axios';

const API_URL = 'http://localhost:9000/api/transactions';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const TransactionService = {
    // Get all transactions
    getAllTransactions: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create a new transaction
    createTransaction: async (transactionData) => {
        try {
            const response = await axios.post(API_URL, transactionData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update a transaction
    updateTransaction: async (transactionId, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/${transactionId}`, updateData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a transaction
    deleteTransaction: async (transactionId) => {
        try {
            const response = await axios.delete(`${API_URL}/${transactionId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get transaction statistics
    getTransactionStats: async () => {
        try {
            const response = await axios.get(`${API_URL}/stats`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default TransactionService; 