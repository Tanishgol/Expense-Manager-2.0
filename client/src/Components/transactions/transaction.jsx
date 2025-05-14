import React, { useState } from 'react'
import TransactionItem from './transactionitem'
import { FilterIcon, PlusIcon, DownloadIcon, SearchIcon } from 'lucide-react'
export const Transactions = () => {
    const [activeFilter, setActiveFilter] = useState('all')
    const transactions = [
        {
            id: 1,
            title: 'Grocery Shopping',
            amount: -120.5,
            date: '2023-08-15',
            category: 'Food',
            vendor: 'Whole Foods',
        },
        {
            id: 2,
            title: 'Salary Deposit',
            amount: 3200.0,
            date: '2023-08-10',
            category: 'Income',
            vendor: 'Acme Corp',
        },
        {
            id: 3,
            title: 'Electric Bill',
            amount: -85.2,
            date: '2023-08-08',
            category: 'Utilities',
            vendor: 'Power Company',
        },
        {
            id: 4,
            title: 'Freelance Payment',
            amount: 350.0,
            date: '2023-08-05',
            category: 'Income',
            vendor: 'Client XYZ',
        },
        {
            id: 5,
            title: 'Restaurant Dinner',
            amount: -62.3,
            date: '2023-08-03',
            category: 'Dining',
            vendor: 'Italian Bistro',
        },
        {
            id: 6,
            title: 'Gas Station',
            amount: -45.0,
            date: '2023-08-01',
            category: 'Transportation',
            vendor: 'Shell',
        },
        {
            id: 7,
            title: 'Internet Bill',
            amount: -79.99,
            date: '2023-07-28',
            category: 'Utilities',
            vendor: 'Comcast',
        },
        {
            id: 8,
            title: 'Movie Tickets',
            amount: -24.5,
            date: '2023-07-25',
            category: 'Entertainment',
            vendor: 'AMC Theaters',
        },
        {
            id: 9,
            title: 'Pharmacy',
            amount: -32.75,
            date: '2023-07-22',
            category: 'Healthcare',
            vendor: 'CVS',
        },
        {
            id: 10,
            title: 'Clothing Purchase',
            amount: -89.95,
            date: '2023-07-20',
            category: 'Shopping',
            vendor: 'H&M',
        },
    ]
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                    <PlusIcon size={18} className="mr-1" />
                    <span>Add Transaction</span>
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className={`px-3 py-1 rounded-md ${activeFilter === 'all' ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setActiveFilter('income')}
                            className={`px-3 py-1 rounded-md ${activeFilter === 'income' ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Income
                        </button>
                        <button
                            onClick={() => setActiveFilter('expense')}
                            className={`px-3 py-1 rounded-md ${activeFilter === 'expense' ? 'bg-red-100 text-red-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                        >
                            Expenses
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            <SearchIcon
                                size={18}
                                className="text-gray-400 absolute left-3 top-2.5"
                            />
                        </div>
                        <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-50">
                            <FilterIcon size={18} className="text-gray-600" />
                        </button>
                        <button className="border border-gray-300 p-2 rounded-md hover:bg-gray-50">
                            <DownloadIcon size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-3 font-medium">Description</th>
                                <th className="pb-3 font-medium">Category</th>
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions
                                .filter((transaction) => {
                                    if (activeFilter === 'income') return transaction.amount > 0
                                    if (activeFilter === 'expense') return transaction.amount < 0
                                    return true
                                })
                                .map((transaction) => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Showing 10 of 24 transactions</p>
                    <div className="flex space-x-1">
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            1
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                            2
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                            3
                        </button>
                        <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-600">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions