import React, { useState, useEffect } from 'react'
import TransactionItem from './transactionitem'
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

export const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { token } = useAuth();
    const location = useLocation();
    const isDashboard = location.pathname === '/dashboard';

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSorting = () => {
        const sortOrder = [...transactions].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setTransactions(sortOrder);
    };

    const fetchTransactions = async () => {
        try {
            if (!token) {
                throw new Error('No authentication token found');
            }

            const url = isDashboard
                ? 'http://localhost:9000/api/transactions?limit=2000'
                : 'http://localhost:9000/api/transactions';

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch transactions');
            }

            const data = await response.json();
            const sortedTransactions = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            const finalTransactions = isDashboard
                ? sortedTransactions.slice(0, 5)
                : sortedTransactions;

            setTransactions(finalTransactions);
            setError(null);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.message || 'Failed to load transactions');
            toast.error('Failed to load recent transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (transaction) => {
        try {
            console.log('Edit transaction:', transaction);
        } catch (error) {
            console.error('Error editing transaction:', error);
            toast.error('Failed to edit transaction');
        }
    };

    const handleDelete = async (transactionId) => {
        try {
            const response = await fetch(`http://localhost:9000/api/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete transaction');
            }

            setTransactions(prev => prev.filter(t => t._id !== transactionId));
            toast.success('Transaction deleted successfully');
        } catch (error) {
            console.error('Error deleting transaction:', error);
            toast.error('Failed to delete transaction');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <div className="text-red-600 text-sm mb-2">Error</div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{error}</p>
                    <button
                        onClick={fetchTransactions}
                        className="mt-2 px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300">No recent transactions found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead>
                        <tr className="text-left text-gray-500 dark:text-gray-300 border-b">
                            <th className="pb-3 font-medium">Title</th>
                            <th className="pb-3 font-medium">Description</th>
                            <th className="pb-3 font-medium">Category</th>
                            <th className="pb-3 font-medium">Date</th>
                            <th className="pb-3 font-medium text-right">Amount</th>
                            {!isDashboard && (
                                <th className="pb-3 font-medium text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <TransactionItem
                                key={transaction._id}
                                transaction={transaction}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isMobile={false}
                                isDashboard={isDashboard}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid md:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 xss:grid-cols-1 xsss:grid-cols-1 gap-2 gap-y-4 mt-4 lg:hidden">
                {transactions.map((transaction) => (
                    <TransactionItem
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        isMobile={true}
                        isDashboard={isDashboard}
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions