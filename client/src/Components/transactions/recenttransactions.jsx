import React from 'react'
import TransactionItem from './transactionitem'
export const RecentTransactions = () => {
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
    ]
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th className="pb-3 font-medium">Title</th>
                        <th className="pb-3 font-medium">Description</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Amount</th>
                        <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default RecentTransactions