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
    }, []);

    // Update form data when editTransaction changes
    useEffect(() => {
        if (editTransaction) {
            console.log('Setting form data for edit:', editTransaction);
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

    useEffect(() => {
        if (formData.category && formData.type === 'expense') {
            const fetchBudgetInfo = async () => {
                try {
                    const budgets = await BudgetService.getAllBudgets('monthly');
                    const budget = budgets.find(b => b.category === formData.category);
                    if (budget) {
                        const amount = parseFloat(formData.amount) || 0;
                        setBudgetInfo({
                            limit: budget.limit,
                            spent: budget.spent,
                            remaining: budget.limit - budget.spent - amount
                        });
                        setShowBudgetWarning(amount > (budget.limit - budget.spent));
                    } else {
                        setBudgetInfo(null);
                        setShowBudgetWarning(false);
                    }
                } catch (error) {
                    console.error('Error fetching budget info:', error);
                }
            };
            fetchBudgetInfo();
        } else {
            setBudgetInfo(null);
            setShowBudgetWarning(false);
        }
    }, [formData.category, formData.amount, formData.type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        // Check if budget exists for expense category
        if (formData.type === 'expense' && !availableCategories.includes(formData.category)) {
            toast.error('Please set a budget for this category before adding expenses');
            return;
        }

        setIsSubmitting(true);
        try {
            const transactionData = {
                ...formData,
                amount: formData.type === 'expense'
                    ? -Math.abs(parseFloat(formData.amount))
                    : Math.abs(parseFloat(formData.amount)),
                date: new Date(formData.date).toISOString()
            };

            if (editTransaction) {
                transactionData._id = editTransaction._id;
            }

            console.log('Submitting transaction data:', transactionData);
            await onAdd(transactionData);
            onClose();
        } catch (error) {
            console.error('Error submitting transaction:', error);
            toast.error(error.message || 'Failed to add transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategoryChange = (category) => {
        setFormData({
            ...formData,
            category,
            type: category === 'Income' ? 'income' : 'expense'
        });
    };

    const handleTypeChange = (type) => {
        setFormData({
            ...formData,
            type,
            category: type === 'income' ? 'Income' : formData.category === 'Income' ? 'Food' : formData.category
        });
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editTransaction ? "Edit Transaction" : "Add New Transaction"}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            disabled={formData.type === 'income'}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${formData.type === 'income' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            {formData.type === 'income' ? (
                                <option value="Income">Income</option>
                            ) : (
                                <>
                                    <option value="Select Category" disabled>Select Category</option>
                                    {availableCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {formData.type === 'income' && (
                            <p className="mt-1 text-sm text-gray-500">
                                Category is locked to Income for Income type
                            </p>
                        )}
                        {formData.type === 'expense' && !availableCategories.includes(formData.category) && formData.category !== 'Select Category' && (
                            <p className="mt-1 text-sm text-red-500">
                                Please set a budget for this category first
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleTypeChange(e.target.value)}
                            disabled={formData.category === 'Income'}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 ${formData.type === 'income'
                                ? 'border-green-300 bg-green-50'
                                : 'border-gray-300'
                                } ${formData.category === 'Income' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>
                        {formData.category === 'Income' && (
                            <p className="mt-1 text-sm text-gray-500">
                                Type is locked to Income for Income category
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    amount: e.target.value,
                                })
                            }
                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                {budgetInfo && formData.type === 'expense' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Budget Limit</span>
                            <span className="font-medium">${budgetInfo.limit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Remaining</span>
                            <span className={`font-medium ${budgetInfo.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${budgetInfo.remaining.toFixed(2)}
                            </span>
                        </div>
                        {showBudgetWarning && (
                            <div className="mt-2 flex items-center text-red-600 text-sm">
                                <AlertCircle size={16} className="mr-1" />
                                <span>This transaction exceeds your budget limit</span>
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
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTransactionModal;