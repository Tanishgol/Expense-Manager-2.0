import React from 'react';
import { Modal } from '../modals/Modal';

export const ViewBudgetDetailsModal = ({ isOpen, onClose, budget }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${budget.category} Details`}
        >
            <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Monthly Limit</p>
                            <p className="text-lg font-semibold">
                                ${budget.limit.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Spent</p>
                            <p className="text-lg font-semibold">
                                ${budget.spent.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className="text-lg font-semibold text-green-600">
                                ${(budget.limit - budget.spent).toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Percentage Used</p>
                            <p
                                className={`text-lg font-semibold ${budget.percentage >= 100 ? 'text-red-600' : budget.percentage >= 80 ? 'text-amber-600' : 'text-green-600'}`}
                            >
                                {budget.percentage.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Monthly Breakdown</h4>
                    <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`${budget.color} h-2 rounded-full`}
                                style={{
                                    width: `${Math.min(budget.percentage, 100)}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>$0</span>
                            <span>${budget.limit.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 className="font-medium text-gray-900 mb-2">Spending Tips</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {budget.percentage >= 100 && (
                            <li className="text-red-600">
                                You have exceeded your budget limit
                            </li>
                        )}
                        {budget.percentage >= 80 && budget.percentage < 100 && (
                            <li className="text-amber-600">
                                You are approaching your budget limit
                            </li>
                        )}
                        <li>
                            Daily budget remaining: $
                            {((budget.limit - budget.spent) / 30).toFixed(2)}
                        </li>
                        <li>Average daily spending: ${(budget.spent / 30).toFixed(2)}</li>
                    </ul>
                </div>
                <div className="mt-5">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ViewBudgetDetailsModal;