const express = require('express');
const router = express.Router();
const AnnualGoalController = require('../controller/annualGoalController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, AnnualGoalController.getAllGoals);
router.post('/', verifyToken, AnnualGoalController.createGoal);
router.put('/:id', verifyToken, AnnualGoalController.updateGoal);
router.delete('/:id', verifyToken, AnnualGoalController.deleteGoal);
router.post('/:id/add-funds', verifyToken, AnnualGoalController.addFunds);

module.exports = router; 