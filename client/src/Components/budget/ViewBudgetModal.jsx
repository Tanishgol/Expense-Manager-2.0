import React, { useState, useEffect } from 'react';
import { Modal } from '../modals/Modal';
import { AlertCircle } from 'lucide-react';

export const ViewBudgetModal = ({ isOpen, onClose, budget, onSubmit }) => {
    const [formData, setFormData] = useState({
        category: '',
        limit: '',
        spent: '',
        description: ''
    });

    useEffect(() => {
        if (budget) {
            setFormData({
                category: budget.category || '',
                limit: budget.limit?.toString() || '',
                spent: budget.spent?.toString() || '',
                description: budget.description || ''
            });
        }
    }, [budget]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBudget = {
            ...formData,
            limit: parseFloat(formData.limit),
            spent: parseFloat(formData.spent),
            percentage: (parseFloat(formData.spent) / parseFloat(formData.limit)) * 100
        };
        onSubmit(newBudget);
        onClose();
    };

    const remaining = parseFloat(formData.limit) - parseFloat(formData.spent);
    const isOverBudget = remaining < 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${budget ? 'Edit' : 'View'} Budget: ${budget?.category}`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={budget}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monthly Limit
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.limit}
                                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount Spent
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">$</span>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.spent}
                                onChange={(e) => setFormData({ ...formData, spent: e.target.value })}
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Budget Limit</span>
                        <span className="font-medium">${parseFloat(formData.limit).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Amount Spent</span>
                        <span className="font-medium">${parseFloat(formData.spent).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Remaining</span>
                        <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                            ${remaining.toFixed(2)}
                        </span>
                    </div>
                    {isOverBudget && (
                        <div className="mt-2 flex items-center text-red-600 text-sm">
                            <AlertCircle size={16} className="mr-1" />
                            <span>You have exceeded your budget limit</span>
                        </div>
                    )}
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    >
                        {budget ? 'Update Budget' : 'Save Budget'}
                    </button>
                    <button
                        type="button"
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

export default ViewBudgetModal; 