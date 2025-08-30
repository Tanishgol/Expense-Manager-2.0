const SavingsGoal = require('../model/savingsGoal');
const SavingsGoalService = require('../services/savingsGoalService');

exports.createGoal = async (req, res) => {
  try {
    console.log('=== BACKEND: createSavingsGoal called ===');
    console.log('Backend: Request body received:', req.body);
    console.log('Backend: User ID from token:', req.userId);
    
    const goalData = {
      ...req.body,
      user: req.userId
    };
    console.log('Backend: Final goal data to save:', goalData);
    
    const goal = new SavingsGoal(goalData);  
    await goal.save();
    console.log('Savings goal saved to database:', goal);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error saving savings goal:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getAllGoals = async (req, res) => {
    try {
        const goals = await SavingsGoalService.getAllGoals(req.userId);
        res.json(goals);
    } catch (error) {
        console.error('Fetch savings goals error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getActiveGoals = async (req, res) => {
    try {
        const goals = await SavingsGoalService.getActiveGoals(req.userId);
        res.json(goals);
    } catch (error) {
        console.error('Fetch active savings goals error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateGoal = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedGoal = await SavingsGoalService.updateGoal(id, req.userId, updateData);
        
        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        res.json(updatedGoal);
    } catch (error) {
        console.error('Update savings goal error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedGoal = await SavingsGoalService.deleteGoal(id, req.userId);
        
        if (!deletedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        res.json({ message: 'Goal deleted successfully' });
    } catch (error) {
        console.error('Delete savings goal error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.addFunds = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        
        const updatedGoal = await SavingsGoalService.addFunds(id, req.userId, amount);
        
        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        res.json(updatedGoal);
    } catch (error) {
        console.error('Add funds to savings goal error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.toggleGoalStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedGoal = await SavingsGoalService.toggleGoalStatus(id, req.userId);
        
        if (!updatedGoal) {
            return res.status(404).json({ message: 'Goal not found' });
        }
        
        res.json(updatedGoal);
    } catch (error) {
        console.error('Toggle savings goal status error:', error);
        res.status(500).json({ message: error.message });
    }
};
