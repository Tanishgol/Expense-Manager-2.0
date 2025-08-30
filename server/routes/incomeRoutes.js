const express = require('express');
const router = express.Router();
const incomeController = require('../controller/incomeController');
const { verifyToken } = require('../middleware/auth');

router.get('/summary', verifyToken, incomeController.getIncomeSummary);
router.get('/current', verifyToken, incomeController.getCurrentMonthIncome);
router.get('/has-income', verifyToken, incomeController.hasCurrentMonthIncome);
router.post('/contributions', verifyToken, incomeController.createContribution);
router.get('/contributions/:goalId', verifyToken, incomeController.getGoalContributions);

module.exports = router;
