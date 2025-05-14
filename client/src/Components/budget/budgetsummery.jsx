import React from 'react'
import CategoryBudget from './CategoryBudget'
export const BudgetSummary = () => {
    const budgetCategories = [
        {
            category: 'Housing',
            spent: 1200,
            limit: 1500,
            percentage: 80,
            color: 'bg-blue-500',
        },
        {
            category: 'Food',
            spent: 420,
            limit: 500,
            percentage: 84,
            color: 'bg-green-500',
        },
        {
            category: 'Transportation',
            spent: 240,
            limit: 300,
            percentage: 80,
            color: 'bg-purple-500',
        },
        {
            category: 'Entertainment',
            spent: 180,
            limit: 150,
            percentage: 120,
            color: 'bg-amber-500',
        },
        {
            category: 'Utilities',
            spent: 100,
            limit: 150,
            percentage: 67,
            color: 'bg-red-500',
        },
    ]
    return (
        <div className="space-y-4">
            {budgetCategories.map((budget, index) => (
                <CategoryBudget key={index} budget={budget} />
            ))}
            <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                Manage Budget Limits
            </button>
        </div>
    )
}

export default BudgetSummary