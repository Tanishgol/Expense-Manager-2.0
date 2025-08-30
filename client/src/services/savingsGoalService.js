import axios from 'axios';

const API_URL = 'http://localhost:9000/api/savings-goals';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const SavingsGoalService = {
    // Create a new savings goal
    createGoal: async (goalData) => {
        try {
            const response = await axios.post(API_URL, goalData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get all savings goals
    getAllGoals: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get active savings goals
    getActiveGoals: async () => {
        try {
            const response = await axios.get(`${API_URL}/active`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get a specific savings goal
    getGoalById: async (goalId) => {
        try {
            const response = await axios.get(`${API_URL}/${goalId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update a savings goal
    updateGoal: async (goalId, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/${goalId}`, updateData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete a savings goal
    deleteGoal: async (goalId) => {
        try {
            const response = await axios.delete(`${API_URL}/${goalId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add funds to a savings goal
    addFunds: async (goalId, amount) => {
        try {
            const response = await axios.post(`${API_URL}/${goalId}/add-funds`, { amount }, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Toggle goal status
    toggleGoalStatus: async (goalId) => {
        try {
            const response = await axios.post(`${API_URL}/${goalId}/toggle-status`, {}, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default SavingsGoalService;
