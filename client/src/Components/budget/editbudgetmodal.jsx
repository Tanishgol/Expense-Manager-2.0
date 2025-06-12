import React, { useState, useEffect } from 'react';
import { Modal } from '../modals/Modal';
import BudgetService from '../../services/budgetService';
import toast from 'react-hot-toast';

export const EditBudgetModal = ({ isOpen, onClose, budget, onSubmit, totalBudget, currentTotal }) => {
    const [formData, setFormData] = useState({
        limit: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (budget) {
            setFormData({
                limit: budget.limit?.toString() || ''
            });
        }
    }, [budget]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const numValue = parseFloat(formData.limit);

            if (isNaN(numValue) || numValue < 0) {
                setError('Please enter a valid amount');
                setLoading(false);
                return;
            }

            // Calculate new total budget
            let newTotal;
            if (budget?._id) {
                // For updates, subtract old budget and add new one
                newTotal = currentTotal - budget.limit + numValue;
            } else {
                // For new budgets, add to current total
                newTotal = currentTotal + numValue;
            }

            // Check if new total exceeds the target budget
            if (newTotal > totalBudget) {
                setError(`Total budget cannot exceed target budget of $${totalBudget.toLocaleString()}`);
                setLoading(false);
                return;
            }

            const newBudget = {
                ...formData,
                limit: numValue
            };

            if (budget?._id) {
                // Update existing budget
                await BudgetService.updateBudget(budget._id, {
                    limit: numValue,
                    color: budget.color
                });
            } else {
                // Create new budget
                await BudgetService.createBudget({
                    ...newBudget,
                    type: 'monthly',
                    color: 'bg-blue-500'
                });
            }

            await onSubmit(newBudget);
            onClose();
        } catch (error) {
            setError(error.message || 'Failed to save budget');
            toast.error('Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${budget?._id ? 'Edit' : 'Create'} ${budget?.category || 'Budget'}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Monthly Budget Limit
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={formData.limit}
                            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            disabled={loading}
                            className={`w-full pl-7 pr-12 px-3 py-2 border rounded-md focus:outline-none focus:ring-1
        ${error
                                    ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                    : 'border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                }
        bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />

                    </div>
                    {error && (
                        <div className="mt-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                </div>

                {budget?.spent !== undefined && (
                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Current Spending</span>
                            <span className="font-medium text-gray-600 dark:text-gray-300">${budget.spent.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Remaining</span>
                            <span className="font-medium text-green-600 dark:text-lime-500">
                                ${(parseFloat(formData.limit) - (budget.spent || 0)).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Total Budget</span>
                            <span className="font-medium text-blue-600 dark:text-cyan-500">
                                ${(totalBudget ?? 0).toFixed(2)}
                            </span>

                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Remaining Budget</span>
                            <span className="font-medium text-red-600 dark:text-red-500">${(totalBudget - currentTotal).toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto
                            ${loading || error
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                            }`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button"
                        disabled={loading}
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-dark-card dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-gray-600 dark:hover:ring-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default EditBudgetModal;