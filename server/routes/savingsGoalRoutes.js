const express = require('express');
const router = express.Router();
const savingsGoalController = require('../controller/savingsGoalController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, savingsGoalController.getAllGoals);
router.get('/active', verifyToken, savingsGoalController.getActiveGoals);
router.post('/', verifyToken, savingsGoalController.createGoal);
router.put('/:id', verifyToken, savingsGoalController.updateGoal);
router.delete('/:id', verifyToken, savingsGoalController.deleteGoal);
router.post('/:id/add-funds', verifyToken, savingsGoalController.addFunds);
router.post('/:id/toggle-status', verifyToken, savingsGoalController.toggleGoalStatus);

module.exports = router;
