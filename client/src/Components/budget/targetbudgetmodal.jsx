import React, { useEffect, useState } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Modal } from '../modals/Modal';
import { useAuth } from '../../context/AuthContext';
import BudgetService from '../../services/budgetService';
import toast from 'react-hot-toast';

export const TargetBudgetModal = ({
    isOpen,
    onClose,
    initialValue,
    monthlyIncome,
    onTargetUpdated,
    isEditing
}) => {
    const { token } = useAuth();
    const [newTarget, setNewTarget] = useState(initialValue?.toString() || '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setNewTarget(initialValue?.toString() || '');
        setError('');
    }, [initialValue, isOpen]);

    const handleTargetChange = (value) => {
        setNewTarget(value);
        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
            setError('Please enter a valid number');
        } else if (monthlyIncome <= 0) {
            setError('No income recorded for this month. Please add income transactions first.');
        } else if (numValue > monthlyIncome) {
            setError(`Budget cannot exceed your monthly income of $${monthlyIncome.toLocaleString()}`);
        } else if (numValue <= 0) {
            setError('Budget must be greater than zero');
        } else {
            setError('');
        }
    };

    const handleSubmit = async () => {
        const numValue = parseFloat(newTarget);

        if (monthlyIncome <= 0) {
            toast.error('No income recorded for this month. Please add income transactions first.');
            return;
        }

        if (error || numValue <= 0 || numValue > monthlyIncome) {
            toast.error('Please fix the errors before saving');
            return;
        }

        setLoading(true);
        try {
            // Save to database first
            await BudgetService.setTotalBudget(numValue);

            // Create default budget categories if they don't exist
            const defaultCategories = [
                'Food',
                'Housing',
                'Transportation',
                'Utilities',
                'Healthcare',
                'Entertainment',
                'Shopping',
                'Personal Care',
                'Other'
            ];

            for (const category of defaultCategories) {
                try {
                    await BudgetService.createBudget({
                        category,
                        limit: 0,
                        type: 'monthly',
                        color: 'bg-blue-500'
                    });
                } catch (error) {
                    if (!error.message.includes('already exists')) {
                        throw error;
                    }
                }
            }

            // Only update UI after successful save
            if (onTargetUpdated) {
                onTargetUpdated(numValue);
            }
            // Dispatch budget change event
            window.dispatchEvent(new Event('budgetChange'));
            toast.success(isEditing ? 'Total budget updated successfully' : 'Total budget set successfully');
            onClose();
        } catch (error) {
            setError(error.message || 'Error updating budget target');
            toast.error('Failed to update budget target');
        } finally {
            setLoading(false);
        }
    };

    if (monthlyIncome <= 0) {
        return (
            <Modal isOpen={isOpen} onClose={onClose} title="No Income Recorded">
                <div className="space-y-4">
                    <div className="text-center py-4">
                        <p className="text-gray-600 mb-2">No income recorded for this month</p>
                        <p className="text-sm text-gray-500 mb-4">Please add income transactions before setting up your budget.</p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Edit Monthly Budget Target" : "Set Monthly Budget Target"}>
            <div className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Income:</span>
                        <span className="font-medium text-gray-600 dark:text-gray-300">${monthlyIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Available to Budget:</span>
                        <span className="font-medium text-green-600 dark:text-lime-500">
                            ${(monthlyIncome - parseFloat(newTarget || '0')).toLocaleString()}
                        </span>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Target</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            value={newTarget}
                            onChange={(e) => handleTargetChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !error && !loading) {
                                    handleSubmit();
                                }
                            }}
                            className={`w-full pl-7 pr-12 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
        ${error
                                    ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500 dark:focus:ring-red-500'
                                    : 'border-gray-300 dark:border-dark-border focus:border-indigo-500 focus:ring-indigo-500 dark:focus:ring-indigo-400'
                                }
        [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                            placeholder="0.00"
                            disabled={loading}
                        />
                    </div>
                    {error && (
                        <div className="mt-2 flex items-center text-sm text-red-600">
                            <AlertCircleIcon className="h-4 w-4 mr-1" />
                            {error}
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>Budget Usage</span>
                        <span>
                            {Math.round((parseFloat(newTarget || '0') / monthlyIncome) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all ${error ? 'bg-red-500 dark:bg-red-500' : 'bg-indigo-600 dark:bg-indigo-600'}`}
                            style={{
                                width: `${Math.min(
                                    (parseFloat(newTarget || '0') / monthlyIncome) * 100,
                                    100
                                )}%`,
                            }}
                        ></div>
                    </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!!error || loading}
                        className={`px-4 py-2 rounded-md text-white ${error || loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                    >
                        {loading ? 'Saving...' : isEditing ? 'Update Target' : 'Set Target'}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TargetBudgetModal;