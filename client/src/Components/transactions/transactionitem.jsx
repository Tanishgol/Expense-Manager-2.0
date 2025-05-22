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
    Edit,
    Trash2,
} from 'lucide-react';

const TransactionItem = ({ transaction }) => {
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
            default:
                return <CircleHelp size={16} className="text-gray-500" />;
        }
    };

    return (
        <tr className="border-b hover:bg-gray-50">
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
                <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-600">
                    {category}
                </span>
            </td>
            <td className="py-4 text-gray-600">
                {format(new Date(date), 'MMM dd, yyyy')}
            </td>
            <td className="py-4 text-right">
                <span className={`font-medium ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                    {isIncome ? '+' : '-'}${Math.abs(amount).toFixed(2)}
                </span>
            </td>
            <td className="py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button className="p-1 text-gray-500 hover:text-indigo-600 transition-colors">
                        <Edit size={16} />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TransactionItem;