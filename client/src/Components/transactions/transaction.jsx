import React, { useState, useEffect } from 'react'
import TransactionItem from './transactionitem'
import { FilterIcon, PlusIcon, DownloadIcon, SearchIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext';
import AddTransactionModal from './AddTransactionModal';

export const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const { token } = useAuth();

    // Get unique categories from transactions
    const categories = [...new Set(transactions.map(t => t.category))];

    // Filter transactions based on search and category filters
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(transaction.category);

        return matchesSearch && matchesCategory;
    });

    // Handle category filter toggle
    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleDeleteTransaction = async (transactionId) => {
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
        } catch (error) {
            console.error('Error deleting transaction:', error);
            setError(error.message || 'Failed to delete transaction');
        }
    };

    const handleAddTransaction = async (transactionData) => {
        try {
            const method = editingTransaction ? 'PUT' : 'POST';
            const url = editingTransaction
                ? `http://localhost:9000/api/transactions/${editingTransaction._id}`
                : 'http://localhost:9000/api/transactions';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save transaction');
            }

            const savedTransaction = await response.json();

            if (editingTransaction) {
                setTransactions(prev =>
                    prev.map(t => t._id === savedTransaction._id ? savedTransaction : t)
                );
            } else {
                setTransactions(prev => [...prev, savedTransaction]);
            }

            setEditingTransaction(null);
        } catch (error) {
            console.error('Error saving transaction:', error);
            setError(error.message || 'Failed to save transaction');
        }
    };

    const handleDownload = () => {
        // Implement CSV download functionality
        const headers = ['Title', 'Description', 'Category', 'Date', 'Amount'];
        const csvData = transactions.map(t => [
            t.title,
            t.description || '',
            t.category,
            new Date(t.date).toLocaleDateString(),
            t.amount
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await fetch('http://localhost:9000/api/transactions', {
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
                
                const sortedTransactions = data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setTransactions(sortedTransactions);
                setError(null);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError(error.message || 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [token]);


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 text-sm sm:text-base lg:text-lg">Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <div className="text-red-600 text-xl sm:text-2xl mb-2">Error</div>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm sm:text-base lg:text-lg"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="relative w-full md:w-auto">
                        <SearchIcon size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full md:w-[300px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex md:flex-row md:gap-2">
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className="p-2 border mr-2 border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            <FilterIcon size={18} className="text-gray-600" />
                        </button>

                        <button
                            onClick={handleDownload}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            <DownloadIcon size={18} className="text-gray-600" />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setEditingTransaction(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition"
                    >
                        <PlusIcon size={18} className="mr-1" />
                        <span>Add Transaction</span>
                    </button>
                </div>
            </div>

            {showFilter && (
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`px-3 py-1 rounded-full text-sm ${selectedCategories.includes(category)
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-gray-700">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b text-left text-gray-500">
                                <th className="pb-3 font-medium">Title</th>
                                <th className="pb-3 font-medium">Description</th>
                                <th className="pb-3 font-medium">Category</th>
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium text-right">Amount</th>
                                <th className="pb-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((transaction) => (
                                    <TransactionItem
                                        key={transaction._id}
                                        transaction={transaction}
                                        onEdit={handleEditTransaction}
                                        onDelete={handleDeleteTransaction}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingTransaction(null);
                }}
                onAdd={handleAddTransaction}
                editTransaction={editingTransaction}
            />
        </div>
    );
};

export default Transactions;