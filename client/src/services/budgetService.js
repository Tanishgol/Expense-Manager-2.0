import axios from 'axios';

const API_URL = 'http://localhost:9000/api/budgets';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const BudgetService = {
    // Create a new budget
    createBudget: async (budgetData) => {
        try {
            const response = await axios.post(API_URL, budgetData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all budgets
    getAllBudgets: async (type = 'monthly') => {
        try {
            const response = await axios.get(`${API_URL}?type=${type}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get budget summary
    getBudgetSummary: async () => {
        try {
            const response = await axios.get(`${API_URL}/summary`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get a specific budget
    getBudgetById: async (budgetId) => {
        try {
            const response = await axios.get(`${API_URL}/${budgetId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update a budget
    updateBudget: async (budgetId, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/${budgetId}`, updateData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a budget
    deleteBudget: async (budgetId) => {
        try {
            const response = await axios.delete(`${API_URL}/${budgetId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getTotalBudget: async () => {
        const response = await fetch('http://localhost:9000/api/budgets/total', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch total budget');
        }

        return await response.json();
    },

    setTotalBudget: async (amount) => {
        const response = await fetch('http://localhost:9000/api/budgets/total', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ amount })
        });

        if (!response.ok) {
            throw new Error('Failed to set total budget');
        }

        return await response.json();
    }
};

export default BudgetService; 