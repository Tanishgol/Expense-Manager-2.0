const express = require('express');
const router = express.Router();
const annualGoalController = require('../controller/annualGoalController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, annualGoalController.getAllGoals);
router.get('/active', verifyToken, annualGoalController.getActiveGoals);
router.post('/', verifyToken, annualGoalController.createGoal);
router.put('/:id', verifyToken, annualGoalController.updateGoal);
router.delete('/:id', verifyToken, annualGoalController.deleteGoal);
router.post('/:id/add-funds', verifyToken, annualGoalController.addFunds);
router.post('/:id/toggle-status', verifyToken, annualGoalController.toggleGoalStatus);

module.exports = router;