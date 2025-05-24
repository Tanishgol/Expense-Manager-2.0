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

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-orange-500';
        if (percentage >= 60) return 'bg-yellow-500';
        if (percentage >= 40) return 'bg-amber-500';
        if (percentage >= 20) return 'bg-lime-500';
        return 'bg-green-500';
    };

    const getBackgroundColor = (percentage) => {
        if (percentage >= 100) return 'bg-red-50';
        if (percentage >= 80) return 'bg-orange-50';
        if (percentage >= 60) return 'bg-yellow-50';
        if (percentage >= 40) return 'bg-amber-50';
        if (percentage >= 20) return 'bg-lime-50';
        return 'bg-green-50';
    };

    const getStatusColor = (percentage) => {
        if (percentage >= 100) return 'text-red-500';
        if (percentage >= 80) return 'text-orange-500';
        if (percentage >= 60) return 'text-yellow-500';
        if (percentage >= 40) return 'text-amber-500';
        if (percentage >= 20) return 'text-lime-500';
        return 'text-green-500';
    };

    return (
        <div className={`space-y-2 p-4 rounded-lg ${getBackgroundColor(budget.percentage)}`}>
            <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700">
                        {budget.category}
                    </span>
                    <span className={`text-sm font-medium ${getStatusColor(budget.percentage)}`}>
                        {formatAmount(budget.spent)} / {formatAmount(budget.limit)}
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full ${getProgressColor(budget.percentage)}`}
                        style={{
                            width: `${Math.min(budget.percentage, 100)}%`,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default CategoryBudget;