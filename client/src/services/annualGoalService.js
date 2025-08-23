import axios from 'axios';

const API_URL = 'http://localhost:9000/api/annual-goals';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const AnnualGoalService = {
    // Get all annual goals
    getAllGoals: async () => {
        try {
            const response = await axios.get(API_URL, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create a new annual goal
    createGoal: async (goalData) => {
        try {
            console.log('API Service: Making POST request to:', API_URL);
            console.log('API Service: Request data:', goalData);
            console.log('API Service: Auth headers:', getAuthHeader());
            
            const response = await axios.post(API_URL, goalData, getAuthHeader());
            console.log('API Service: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('API Service: Error occurred:', error);
            console.error('API Service: Error response:', error.response?.data);
            throw error.response?.data || error.message;
        }
    },

    // Update an annual goal
    updateGoal: async (goalId, updateData) => {
        try {
            const response = await axios.put(`${API_URL}/${goalId}`, updateData, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete an annual goal
    deleteGoal: async (goalId) => {
        try {
            const response = await axios.delete(`${API_URL}/${goalId}`, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Add funds to a goal
    addFunds: async (goalId, amount) => {
        try {
            const response = await axios.post(`${API_URL}/${goalId}/add-funds`, { amount }, getAuthHeader());
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default AnnualGoalService; 