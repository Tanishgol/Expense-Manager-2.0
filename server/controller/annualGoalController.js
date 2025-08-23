const AnnualGoal = require('../model/annualGoal');
const AnnualGoalService = require('../services/annualGoalService');

exports.createGoal = async (req, res) => {
  try {
    console.log('=== BACKEND: createGoal called ===');
    console.log('Backend: Request body received:', req.body);
    console.log('Backend: User ID from token:', req.userId);
    
    const goalData = {
      ...req.body,
      user: req.userId // assuming you use authentication middleware
    };
    console.log('Backend: Final goal data to save:', goalData);
    
    const goal = new AnnualGoal(goalData);  
    await goal.save();
    console.log('Goal saved to database:', goal); // Add this line for debugging
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error saving goal:', error); // Add this line for debugging
    res.status(400).json({ message: error.message });
  }
};

exports.getAllGoals = async (req, res) => {
    try {
        const goals = await AnnualGoalService.getAllGoals(req.userId);
        res.json(goals);
    } catch (error) {
        console.error('Fetch goals error:', error);
        res.status(500).json({ message: error.message });
    }
};