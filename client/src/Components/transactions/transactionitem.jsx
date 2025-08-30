import React from 'react';
import { format } from 'date-fns';
import {
    Utensils,
    House,
    Car,
    Hospital,
    Plug,
    Drama,
    ShoppingCart,
    Sparkles,
    CircleHelp,
    BanknoteArrowUp,
    Edit,
    Trash2,
} from 'lucide-react';

const TransactionItem = ({ transaction, onEdit, onDelete, isMobile, isDashboard = false }) => {
    const { title, description, category, date, amount } = transaction;
    const isIncome = amount > 0;

    const getCategoryIcon = (category = '') => {
        switch (category.toLowerCase()) {
            case 'food':
                return <Utensils size={16} className="text-green-500" />;
            case 'housing':
                return <House size={16} className="text-blue-500" />;
            case 'transportation':
                return <Car size={16} className="text-purple-500" />;
            case 'healthcare':
                return <Hospital size={16} className="text-pink-500" />;
            case 'utilities':
                return <Plug size={16} className="text-red-500" />;
            case 'entertainment':
                return <Drama size={16} className="text-yellow-500" />;
            case 'shopping':
                return <ShoppingCart size={16} className="text-blue-400" />;
            case 'personal care':
                return <Sparkles size={16} className="text-violet-500" />;
            case 'other':
                return <CircleHelp size={16} className="text-gray-500" />;
            case 'income':
                return <BanknoteArrowUp size={16} className="text-green-600" />;
            default:
                return <CircleHelp size={16} className="text-gray-400" />;
        }
    };

    if (isMobile) {
        return (
            <div
                className={`p-4 rounded-lg border 
    ${isIncome
                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                        : 'bg-dark dark:bg-dark-card border-gray-200 dark:border-gray-700'}`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="font-medium text-gray-800 dark:text-gray-300">{title}</span>
                    </div>
                    <span className={`font-medium ${isIncome ? 'text-green-600 dark:text-lime-500' : 'text-red-600 dark:text-red-500'}`}>
                        {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className={`px-2 py-1 rounded-full ${category === 'Income'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : category === 'Other'
                            ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                        {category}
                    </span>
                    <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
                </div>
                {description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{description}</p>
                )}
                {!isDashboard && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={() => onEdit(transaction)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-white hover:bg-indigo-100 rounded transition dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-100"
                        >
                            <Edit size={16} />
                            <span>Edit</span>
                        </button>

                        <button
                            onClick={() => onDelete(transaction._id)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-red-800 text-yellow-200 hover:bg-red-100 rounded transition dark:bg-red-800 dark:text-yellow-200 dark:hover:bg-red-100"
                        >
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <tr
            className={`border-b 
              ${isIncome ? 'bg-green-50 dark:bg-green-900/30' : 'bg-dark dark:bg-dark'} 
              hover:bg-gray-50 dark:hover:bg-gray-700`}
        >
            <td className="py-4">
                <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium text-gray-800 dark:text-gray-300">{title}</span>
                </div>
            </td>
            <td className="py-4">
                <span className="text-gray-600 dark:text-gray-300">{description || 'NA'}</span>
            </td>
            <td className="py-4">
                <span className={`px-2 py-1 text-sm rounded-full ${category === 'Income'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : category === 'Other'
                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    }`}>
                    {category}
                </span>
            </td>
            <td className="py-4 text-gray-600 dark:text-gray-300">
                {format(new Date(date), 'MMM dd, yyyy')}
            </td>
            <td className="py-4 text-right">
                <span className={`font-medium ${isIncome
                    ? 'text-green-600 bg-green-50 px-2 py-1 rounded dark:bg-green-900 dark:text-green-300'
                    : 'text-red-600 dark:text-red-500'
                    }`}>
                    {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                </span>
            </td>
            {!isDashboard && (
                <td className="py-4 text-right">
                    <div className="inline-flex justify-end items-center gap-2">
                        <button
                            onClick={() => onEdit(transaction)}
                            className="p-1  bg-gray-800 text-white rounded transition-colors dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-indigo-100"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(transaction._id)}
                            className="p-1 bg-red-800 text-yellow-200 rounded transition-colors dark:bg-red-800 dark:text-yellow-200 dark:hover:bg-red-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            )}
        </tr>
    );
};

export default TransactionItem;