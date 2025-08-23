const express = require('express');
const router = express.Router();
const annualGoalController = require('../controller/annualGoalController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, annualGoalController.getAllGoals);
router.post('/', verifyToken, annualGoalController.createGoal);

module.exports = router;