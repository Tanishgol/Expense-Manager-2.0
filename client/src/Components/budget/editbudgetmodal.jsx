import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';

export const EditBudgetModal = ({ isOpen, onClose, budget, onSubmit }) => {
    const [formData, setFormData] = useState({
        limit: ''
    });

    useEffect(() => {
        if (budget) {
            setFormData({
                limit: budget.limit?.toString() || ''
            });
        }
    }, [budget]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newBudget = {
            ...formData,
            limit: parseFloat(formData.limit)
        };
        await onSubmit(newBudget);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit ${budget?.category} Budget`}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Budget Limit
                    </label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            required
                            value={formData.limit}
                            onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                            className="w-full pl-7 pr-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Spending</span>
                        <span className="font-medium">${budget?.spent?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Remaining</span>
                        <span className="font-medium text-green-600">
                            ${(parseFloat(formData.limit) - (budget?.spent || 0)).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    >
                        Save Changes
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

export default EditBudgetModal;