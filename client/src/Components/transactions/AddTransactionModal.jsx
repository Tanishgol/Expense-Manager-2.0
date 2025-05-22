import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

const AddTransactionModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    const categories = [
        'Food', 'Housing', 'Transportation', 'Dining',
        'Utilities', 'Healthcare', 'Entertainment', 'Shopping', 'Other'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const parsedAmount = parseFloat(formData.amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) return;

        const finalAmount = formData.type === 'expense'
            ? -Math.abs(parsedAmount)
            : Math.abs(parsedAmount);

        onAdd({ ...formData, amount: finalAmount });

        // Reset and close
        setFormData({
            title: '',
            amount: '',
            category: '',
            type: 'expense',
            date: new Date().toISOString().split('T')[0],
            description: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all"
                    onClick={(e) => e.stopPropagation()} // Prevent close on modal click
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Add Transaction</h2>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                            <XIcon size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Enter transaction title"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="Optional description"
                                rows="2"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                            <div className="relative">
                                <span className="absolute left-4 top-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                                This will be recorded as an expense
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2.5 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-500 transition-all"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-all"
                            >
                                Add Expense
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddTransactionModal;