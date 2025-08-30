import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import toast from 'react-hot-toast';

const GoalModal = ({ isOpen, onClose, type = 'savings', onSubmit, initialValues = {}, submitButtonLabel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    targetAmount: '',
    monthlyContribution: '',
  });
  const [errors, setErrors] = useState({});
  const [suggestedMonthly, setSuggestedMonthly] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Convert ISO dates to YYYY-MM-DD format for input fields
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        startDate: formatDateForInput(initialValues.startDate),
        endDate: formatDateForInput(initialValues.endDate),
        targetAmount: initialValues.targetAmount || '',
        monthlyContribution: initialValues.monthlyContribution || '',
      });
      setErrors({});
    }
  }, [isOpen, JSON.stringify(initialValues)]);

  // Calculate suggested monthly contribution when dates or target amount changes
  useEffect(() => {
    if (formData.startDate && formData.endDate && formData.targetAmount) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const targetAmount = parseFloat(formData.targetAmount);

      if (startDate < endDate && targetAmount > 0) {
        const monthDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
        const suggested = Math.ceil(targetAmount / Math.max(1, monthDiff));
        setSuggestedMonthly(suggested);
      }
    }
  }, [formData.startDate, formData.endDate, formData.targetAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) {
      newErrors.name = 'Goal name is required';
    }

    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate <= startDate) {
        newErrors.endDate = 'End Date must be after Start Date';
      }
    }

    // Monthly contribution validation
    if (formData.startDate && formData.endDate && formData.targetAmount && formData.monthlyContribution) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const targetAmount = parseFloat(formData.targetAmount);
      const monthlyContribution = parseFloat(formData.monthlyContribution);

      if (startDate < endDate && targetAmount > 0) {
        const monthDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 30.44));
        const maxMonthly = targetAmount / Math.max(1, monthDiff);

        if (monthlyContribution > maxMonthly) {
          newErrors.monthlyContribution = `Monthly contribution must not exceed $${Math.ceil(maxMonthly).toLocaleString()} for this target and period`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert dates to ISO format for backend
    const submitData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      targetAmount: parseFloat(formData.targetAmount),
      monthlyContribution: parseFloat(formData.monthlyContribution),
      createdAt: initialValues.createdAt || new Date().toISOString(),
    };

    onSubmit(submitData);
    onClose();
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
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
      title={type === 'savings' ? (initialValues && initialValues.name ? 'Edit Savings Goal' : 'Add Savings Goal') : (initialValues && initialValues.name ? 'Edit Annual Goal' : 'Add Annual Goal')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400
              ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            required
            placeholder="Enter goal name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            placeholder="Enter description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400
                ${errors.startDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
                border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400
                ${errors.endDate ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Target Amount ($)
          </label>
          <input
            type="number"
            id="targetAmount"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              ${errors.targetAmount ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            required
            min="0"
            step="0.01"
            placeholder="Enter target amount"
          />
          {errors.targetAmount && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetAmount}</p>
          )}
        </div>

        <div>
          <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Monthly Contribution ($)
          </label>
          <input
            type="number"
            id="monthlyContribution"
            name="monthlyContribution"
            value={formData.monthlyContribution}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
              border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400 
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              ${errors.monthlyContribution ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            required
            min="0"
            max={suggestedMonthly}
            step="0.01"
            placeholder="Enter monthly contribution"
          />
          {suggestedMonthly > 0 && (
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              Suggested: ${suggestedMonthly.toLocaleString()} | Maximum: ${suggestedMonthly.toLocaleString()}
            </p>
          )}
          {errors.monthlyContribution && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.monthlyContribution}</p>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-md hover:bg-gray-50 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-primary-light"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-primary-light border border-transparent rounded-md hover:bg-indigo-700 dark:hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-primary-light"
          >
            {submitButtonLabel || (initialValues && initialValues.name ? 'Update Goal' : 'Create Goal')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal; 