import React from 'react';
import {
    ShoppingBag,
    Home,
    Car,
    Utensils,
    Wifi,
    Heart,
    Briefcase,
} from 'lucide-react';

const TransactionItem = ({ transaction }) => {
    // Early return if transaction is missing
    if (!transaction || typeof transaction !== 'object') {
        return null;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getCategoryIcon = (category = '') => {
        switch (category.toLowerCase()) {
            case 'food':
                return <ShoppingBag size={16} className="text-green-500" />;
            case 'housing':
                return <Home size={16} className="text-blue-500" />;
            case 'transportation':
                return <Car size={16} className="text-purple-500" />;
            case 'dining':
                return <Utensils size={16} className="text-amber-500" />;
            case 'utilities':
                return <Wifi size={16} className="text-red-500" />;
            case 'healthcare':
                return <Heart size={16} className="text-pink-500" />;
            case 'income':
                return <Briefcase size={16} className="text-indigo-500" />;
            default:
                return <ShoppingBag size={16} className="text-gray-500" />;
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50 transition-colors">
            <td className="py-4 px-2">
                <div className="flex items-center gap-3">
                    {getCategoryIcon(transaction.category || '')}
                    <div>
                        <p className="font-medium text-gray-800">{transaction.title || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{transaction.vendor || '-'}</p>
                    </div>
                </div>
            </td>
            <td className="py-4 px-2">
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700 capitalize">
                    {transaction.category || 'Other'}
                </span>
            </td>
            <td className="py-4 px-2 text-gray-600">
                {transaction.date ? formatDate(transaction.date) : '—'}
            </td>
            <td
                className={`py-4 px-2 text-right font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
            >
                {formatAmount(transaction.amount || 0)}
            </td>
        </tr>
    );
};

export default TransactionItem;