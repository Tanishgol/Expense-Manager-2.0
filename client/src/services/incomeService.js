import axios from 'axios';

const API_URL = 'http://localhost:9000/api/income';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const IncomeService = {
    // Get income summary for a specific month
    getIncomeSummary: async (month) => {
        try {
            const response = await axios.get(`${API_URL}/summary?month=${month}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get current month's income summary
    getCurrentMonthIncome: async () => {
        try {
            const response = await axios.get(`${API_URL}/current`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Check if user has income for current month
    hasCurrentMonthIncome: async () => {
        try {
            const response = await axios.get(`${API_URL}/has-income`, getAuthHeader());
            return response.data.hasIncome;
        } catch (error) {
            console.error('Error checking current month income:', error);
            return false;
        }
    },

    // Create a contribution
    createContribution: async (goalId, amount, month, goalType) => {
        try {
            const response = await axios.post(`${API_URL}/contributions`, {
                goalId,
                amount,
                month,
                goalType
            }, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get contributions for a goal
    getGoalContributions: async (goalId) => {
        try {
            const response = await axios.get(`${API_URL}/contributions/${goalId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default IncomeService;
