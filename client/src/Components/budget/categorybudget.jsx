import React from 'react';

const CategoryBudget = ({ budget }) => {
    if (!budget) return null;
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 100) return 'text-red-500';
        if (percentage >= 80) return 'text-amber-500';
        return 'text-green-500';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                    {budget.category}
                </span>
                <span className={`text-sm font-medium ${getStatusColor(budget.percentage)}`}>
                    {formatAmount(budget.spent)} / {formatAmount(budget.limit)}
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${budget.color} h-2 rounded-full`}
                    style={{
                        width: `${Math.min(budget.percentage, 100)}%`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default CategoryBudget;
