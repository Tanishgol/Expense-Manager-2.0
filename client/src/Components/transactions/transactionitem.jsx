import React from 'react';
import { format } from 'date-fns';
import {
    Utensils,
    House,
    Car,
    HandPlatter,
    Plug,
    Hospital,
    CircleHelp,
    Drama,
    BanknoteArrowUp,
    Edit,
    Trash2,
} from 'lucide-react';

const TransactionItem = ({ transaction, onEdit, onDelete, isMobile }) => {
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
            case 'dining':
                return <HandPlatter size={16} className="text-amber-500" />;
            case 'utilities':
                return <Plug size={16} className="text-red-500" />;
            case 'healthcare':
                return <Hospital size={16} className="text-pink-500" />;
            case 'entertainment':
                return <Drama size={16} className="text-yellow-500" />;
            case 'income':
                return <BanknoteArrowUp size={16} className="text-green-500" />;
            default:
                return <CircleHelp size={16} className="text-gray-500" />;
        }
    };

    if (isMobile) {
        return (
            <div className={`p-4 rounded-lg border ${isIncome ? 'bg-green-50/50' : 'bg-white'}`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <span className="font-medium text-gray-800">{title}</span>
                    </div>
                    <span className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                    </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                    <span className={`px-2 py-1 rounded-full ${category === 'Income'
                            ? 'bg-green-100 text-green-700'
                            : category === 'Other'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}>
                        {category}
                    </span>
                    <span>{format(new Date(date), 'MMM dd, yyyy')}</span>
                </div>
                {description && (
                    <p className="text-sm text-gray-600 mb-2">{description}</p>
                )}
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction._id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <tr className={`border-b hover:bg-gray-50 ${isIncome ? 'bg-green-50/50' : ''}`}>
            <td className="py-4">
                <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium text-gray-800">{title}</span>
                </div>
            </td>
            <td className="py-4">
                <span className="text-gray-600">{description || 'NA'}</span>
            </td>
            <td className="py-4">
                <span className={`px-2 py-1 text-sm rounded-full ${category === 'Income'
                        ? 'bg-green-100 text-green-700'
                        : category === 'Other'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-blue-100 text-blue-700'
                    }`}>
                    {category}
                </span>
            </td>
            <td className="py-4 text-gray-600">
                {format(new Date(date), 'MMM dd, yyyy')}
            </td>
            <td className="py-4 text-right">
                <span className={`font-medium ${isIncome
                        ? 'text-green-600 bg-green-50 px-2 py-1 rounded'
                        : 'text-red-600'
                    }`}>
                    {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                </span>
            </td>
            <td className="py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-1 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction._id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionItem;