import React, { useState, useEffect } from 'react';
import { Modal } from '../modals/Modal';
import { AlertCircle } from 'lucide-react';
import BudgetService from '../../services/budgetService';
import toast from 'react-hot-toast';

export const AddTransactionModal = ({ isOpen, onClose, onAdd, editTransaction }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Select Category',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const [budgetInfo, setBudgetInfo] = useState(null);
    const [showBudgetWarning, setShowBudgetWarning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCategories, setAvailableCategories] = useState([]);

    const [dynamicBudgetInfo, setDynamicBudgetInfo] = useState({
        limit: 0,
        spent: 0,
        remaining: 0,
        newTotal: 0
    });

    // Fetch available categories with budgets
    useEffect(() => {
        const fetchAvailableCategories = async () => {
            try {
                const budgets = await BudgetService.getAllBudgets('monthly');
                // Use Set to ensure unique categories
                const uniqueCategories = [...new Set(budgets.map(b => b.category))];
                setAvailableCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching available categories:', error);
            }
        };
        fetchAvailableCategories();
    }, [isOpen]);

    // Update form data when editTransaction changes
    useEffect(() => {
        if (editTransaction) {
            setFormData({
                title: editTransaction.title,
                amount: Math.abs(editTransaction.amount).toString(),
                type: editTransaction.amount >= 0 ? 'income' : 'expense',
                category: editTransaction.category,
                date: new Date(editTransaction.date).toISOString().split('T')[0],
                description: editTransaction.description || ''
            });
        } else {
            // Reset form when adding new transaction
            setFormData({
                title: '',
                amount: '',
                type: 'expense',
                category: 'Select Category',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });
        }
    }, [editTransaction, isOpen]);

    const fetchBudgetInfo = async (category, amount) => {
        try {
            // Get all transactions for the current month
            const response = await fetch('http://localhost:9000/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const transactions = await response.json();
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            // Calculate total spent for this category in current month
            const spent = transactions
                .filter(t => {
                    const transactionDate = new Date(t.date);
                    return (
                        t.category === category &&
                        t.amount < 0 && // Only expenses
                        transactionDate.getMonth() === currentMonth &&
                        transactionDate.getFullYear() === currentYear
                    );
                })
                .reduce((total, t) => total + Math.abs(t.amount), 0);

            // Get budget limit for this category
            const budgetResponse = await fetch('http://localhost:9000/api/budgets', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!budgetResponse.ok) {
                throw new Error('Failed to fetch budgets');
            }

            const budgets = await budgetResponse.json();
            const budget = budgets.find(b => b.category === category);
            const limit = budget ? budget.limit : 0;

            const remaining = limit - spent;
            const newTotal = spent + amount;

            setBudgetInfo({
                limit,
                spent,
                remaining
            });

            setDynamicBudgetInfo({
                limit,
                spent,
                remaining,
                newTotal
            });

            setShowBudgetWarning(newTotal > limit);
        } catch (error) {
            console.error('Error fetching budget info:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const amount = parseFloat(formData.amount);
        if (!amount || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        if (formData.category === 'Select Category') {
            toast.error('Please select a category');
            return;
        }

        // Validate date - prevent future dates
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(23, 59, 59, 999); // End of today
        
        if (selectedDate > today) {
            toast.error('Cannot add transactions with future dates');
            return;
        }

        // For expenses, validate against budget only if amount is being changed
        if (formData.type === 'expense') {
            const isAmountChanged = editTransaction && Math.abs(editTransaction.amount) !== amount;

            if (isAmountChanged) {
                const currentSpent = budgetInfo?.spent || 0;
                const budgetLimit = budgetInfo?.limit || 0;
                // For edits, subtract the old amount from currentSpent before adding new amount
                const oldAmount = editTransaction ? Math.abs(editTransaction.amount) : 0;
                const newTotal = (currentSpent - oldAmount) + amount;

                if (newTotal > budgetLimit) {
                    const remaining = budgetLimit - (currentSpent - oldAmount);
                    toast.error(
                        `This transaction would exceed your budget limit. You have $${remaining.toFixed(2)} remaining in your ${formData.category} budget.`,
                        { duration: 2000 }
                    );
                    return;
                }
            }
        }

        setIsSubmitting(true);
        try {
            const transactionData = {
                ...formData,
                amount: formData.type === 'expense'
                    ? -Math.abs(amount)
                    : Math.abs(amount),
                date: new Date(formData.date).toISOString()
            };

            if (editTransaction) {
                transactionData._id = editTransaction._id;
            }

                        await onAdd(transactionData);
            onClose();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.error(error.message || 'Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleCategoryChange = async (category) => {
        setFormData({
            ...formData,
            category,
            type: category === 'Income' ? 'income' : 'expense'
        });
        if (category !== 'Income' && category !== 'Select Category') {
            await fetchBudgetInfo(category, formData.amount);
        }
    };

    const handleAmountChange = async (amount) => {
        const parsedAmount = parseFloat(amount) || 0;

        // For expenses, validate against budget immediately
        if (formData.type === 'expense' && formData.category !== 'Select Category') {
            const currentSpent = budgetInfo?.spent || 0;
            const budgetLimit = budgetInfo?.limit || 0;
            const remaining = budgetLimit - currentSpent;

            // For new transactions, check if amount exceeds remaining budget
            if (!editTransaction && parsedAmount > remaining) {
                toast.error(
                    `This amount would exceed your budget limit. You have $${remaining.toFixed(2)} remaining in your ${formData.category} budget.`,
                    { duration: 2000 }
                );
                return;
            }
            else if (editTransaction && parsedAmount > Math.abs(editTransaction.amount)) {
                const additionalAmount = parsedAmount - Math.abs(editTransaction.amount);
                if (additionalAmount > remaining) {
                    toast.error(
                        `This amount would exceed your budget limit. You have $${remaining.toFixed(2)} remaining in your ${formData.category} budget.`,
                        { duration: 2000 }
                    );
                    return;
                }
            }
        }

        setFormData({
            ...formData,
            amount
        });

        if (formData.category !== 'Income' && formData.category !== 'Select Category') {
            await fetchBudgetInfo(formData.category, parsedAmount);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
                maxWidth="max-w-md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Category
                        </label>
                        <select
                            required
                            value={formData.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
                        >
                            <option value="Select Category">Select Category</option>
                            <option value="Income">Income</option>
                            {availableCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                placeholder='0.00'
                                value={formData.amount}
                                onChange={(e) => handleAmountChange(e.target.value)}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.date}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    date: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-900 dark:bg-dark-card dark:text-gray-100 dark:border-dark-border dark:[color-scheme:dark]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description (Optional)
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            rows={3}
                            autoCorrect='on'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {budgetInfo && formData.type === 'expense' && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Budget Limit</span>
                                <span className="font-medium text-black dark:text-gray-300">${budgetInfo.limit.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Current Spent</span>
                                <span className="font-medium text-black dark:text-gray-300">${budgetInfo.spent.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-300">Remaining Amount</span>
                                <span className={`font-medium ${dynamicBudgetInfo.remaining < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-lime-500'}`}>
                                    ${dynamicBudgetInfo.remaining.toFixed(2)}
                                </span>
                            </div>
                            {showBudgetWarning && (
                                <div className="mt-2 flex items-center text-red-600 dark:text-red-500 text-sm">
                                    <AlertCircle size={16} className="mr-1" />
                                    <span>This transaction would exceed your budget limit</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            disabled={isSubmitting || (formData.type === 'expense' && !availableCategories.includes(formData.category))}
                            className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto ${isSubmitting || (formData.type === 'expense' && !availableCategories.includes(formData.category))
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500'
                                }`}
                        >
                            {isSubmitting ? 'Saving...' : (editTransaction ? 'Update Transaction' : 'Add Transaction')}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:bg-dark-card dark:text-gray-100 dark:hover:bg-gray-700 dark:ring-gray-600 dark:hover:ring-gray-600"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

        </>
    );
};

export default AddTransactionModal;