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

    // Handle CSV download
    const handleDownload = () => {
        const headers = ['Description', 'Category', 'Amount', 'Date'];
        const csvData = filteredTransactions.map(t => [
            t.title,
            t.category,
            Math.abs(t.amount).toFixed(2),
            new Date(t.date).toLocaleDateString()
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        if (token) {
            fetchTransactions();
        } else {
            setLoading(false);
            setError('Please log in to view transactions');
        }
    }, [token]);

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
            setTransactions(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching transactions:', err);
            setError(err.message);
            setLoading(false);
        }
    };

    const handleAddTransaction = async (transactionData) => {
        try {
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await fetch('http://localhost:9000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(transactionData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add transaction');
            }

            const newTransaction = await response.json();
            setTransactions([newTransaction, ...transactions]);
            setError(null);
        } catch (err) {
            console.error('Error adding transaction:', err);
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-2">Error</div>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={fetchTransactions}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center shadow-sm transition">
                    <PlusIcon size={18} className="mr-1" />
                    <span>Add Transaction</span>
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-3 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                            <SearchIcon size={18} className="text-gray-400 absolute left-3 top-2.5" />
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowFilter(!showFilter)}
                                className={`p-2 border rounded-md transition ${showFilter
                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                    : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                                    }`}
                            >
                                <FilterIcon size={18} />
                            </button>
                            {showFilter && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                    <div className="p-2">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
                                        <div className="space-y-1">
                                            {categories.map(category => (
                                                <label key={category} className="flex items-center space-x-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleCategory(category)}
                                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span>{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleDownload}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                        >
                            <DownloadIcon size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-gray-700">
                        <thead>
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
                                    <TransactionItem key={transaction._id} transaction={transaction} />
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

            <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddTransaction} />
        </div>
    );
};

export default Transactions;