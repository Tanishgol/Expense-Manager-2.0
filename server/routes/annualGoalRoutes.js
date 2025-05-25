const express = require('express');
const router = express.Router();
const AnnualGoalController = require('../controller/annualGoalController');
const { verifyToken } = require('../middleware/auth');

// Get all annual goals
router.get('/', verifyToken, AnnualGoalController.getAllGoals);

// Create a new annual goal
router.post('/', verifyToken, AnnualGoalController.createGoal);

// Update an annual goal
router.put('/:id', verifyToken, AnnualGoalController.updateGoal);

// Delete an annual goal
router.delete('/:id', verifyToken, AnnualGoalController.deleteGoal);

// Add funds to a goal
router.post('/:id/add-funds', verifyToken, AnnualGoalController.addFunds);

module.exports = router; 