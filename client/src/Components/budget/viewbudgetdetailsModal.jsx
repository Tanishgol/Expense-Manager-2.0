import React, { useState, useEffect } from 'react';
import Modal from '../modals/Modal';
import { useAuth } from '../../context/AuthContext';
import { format, startOfMonth, endOfMonth } from 'date-fns';

const ViewBudgetDetailsModal = ({ isOpen, onClose, budget }) => {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            if (!budget) return;

            try {
                const response = await fetch('http://localhost:9000/api/transactions', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }

                const transactions = await response.json();
                const currentMonth = new Date();
                const startDate = startOfMonth(currentMonth);
                const endDate = endOfMonth(currentMonth);

                const categoryTransactions = transactions
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        return (
                            t.category === budget.category &&
                            t.amount < 0 &&
                            transactionDate >= startDate &&
                            transactionDate <= endDate
                        );
                    })
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 3);

                setRecentTransactions(categoryTransactions);
            } catch (error) {
                console.error('Error fetching recent transactions:', error);
            }
        };

        fetchRecentTransactions();
    }, [budget, token]);

    if (!budget) return null;

    const spent = budget.spent || 0;
    const limit = budget.limit || 0;
    const remaining = limit - spent;
    const percentage = limit > 0 ? (spent / limit) * 100 : 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`${budget.category} Budget Details`}
        >
            <div className="space-y-4">
                {/* Budget Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Monthly Limit</span>
                        <span className="font-medium text-black dark:text-white">${limit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Spent</span>
                        <span className="font-medium text-black dark:text-white">${spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Remaining</span>
                        <span
                            className={`font-medium ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            ${remaining.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-500' :
                                percentage >= 80 ? 'bg-orange-500' :
                                    percentage >= 60 ? 'bg-yellow-500' :
                                        percentage >= 40 ? 'bg-amber-500' :
                                            percentage >= 20 ? 'bg-lime-500' : 'bg-green-500'}`}
                            style={{
                                width: `${Math.min(percentage, 100)}%`,
                            }}
                        ></div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Status</h3>
                    <div
                        className={`p-3 rounded-lg ${limit === 0
                                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                : percentage >= 100
                                    ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300'
                                    : percentage >= 80
                                        ? 'bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                                        : 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300'
                            }`}
                    >
                        {limit === 0 ? (
                            <p>Please set your budget limit first to start tracking your expenses.</p>
                        ) : percentage >= 100 ? (
                            <p>Budget exceeded! You've spent more than your monthly limit.</p>
                        ) : percentage >= 80 ? (
                            <p>Warning: You're close to reaching your monthly budget limit.</p>
                        ) : (
                            <p>You're within your budget. Keep up the good work!</p>
                        )}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Recent Transactions - {format(new Date(), 'MMMM yyyy')}
                    </h3>
                    {recentTransactions.length > 0 ? (
                        <div className="space-y-2">
                            {recentTransactions.map((transaction) => (
                                <div
                                    key={transaction._id}
                                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            {transaction.title}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {format(new Date(transaction.date), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                        ${Math.abs(transaction.amount).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            No recent transactions in this category.
                        </p>
                    )}
                </div>
            </div>

        </Modal>
    );
};

export default ViewBudgetDetailsModal;