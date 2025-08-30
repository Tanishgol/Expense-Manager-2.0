import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import IncomeService from '../../services/incomeService';
import toast from 'react-hot-toast';

const ContributionModal = ({ 
  isOpen, 
  onClose, 
  goal, 
  goalType = 'annual',
  onContributionSuccess 
}) => {
  const [amount, setAmount] = useState('');
  const [availableIncome, setAvailableIncome] = useState(0);
  const [loading, setLoading] = useState(false);
  const [incomeSummary, setIncomeSummary] = useState(null);

  useEffect(() => {
    if (isOpen && goal) {
      fetchCurrentMonthIncome();
    }
  }, [isOpen, goal]);

  const fetchCurrentMonthIncome = async () => {
    try {
      const summary = await IncomeService.getCurrentMonthIncome();
      setIncomeSummary(summary);
      setAvailableIncome(summary.available);
    } catch (error) {
      console.error('Error fetching income summary:', error);
      toast.error('Failed to fetch income information');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > availableIncome) {
      toast.error(`Amount exceeds available income. Available: $${availableIncome.toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const result = await IncomeService.createContribution(
        goal._id,
        parseFloat(amount),
        currentMonth,
        goalType
      );

      toast.success(`Successfully contributed $${parseFloat(amount).toLocaleString()} to your goal!`);
      
      if (onContributionSuccess) {
        onContributionSuccess(result.updatedGoal, result.incomeSummary);
      }
      
      onClose();
    } catch (error) {
      console.error('Error creating contribution:', error);
      toast.error(error.message || 'Failed to create contribution');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contribute from Salary"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            {goal?.name}
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Target: ${goal?.targetAmount?.toLocaleString()} | 
            Current: ${goal?.current?.toLocaleString()}
          </p>
          {goal?.startDate && goal?.endDate && (
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Period: {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
            </p>
          )}
        </div>

        {incomeSummary && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              This Month's Income
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Income:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${incomeSummary.totalIncome.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Already Allocated:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${incomeSummary.totalAllocated.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-600 dark:text-gray-400">Available:</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${incomeSummary.available.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contribution Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
              placeholder="Enter amount"
              min="0"
              max={availableIncome}
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum: ${availableIncome.toLocaleString()}
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-primary-light"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableIncome}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-primary-light border border-transparent rounded-md hover:bg-indigo-700 dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Contributing...' : 'Contribute'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContributionModal;
