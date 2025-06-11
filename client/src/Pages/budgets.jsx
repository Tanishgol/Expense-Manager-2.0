import React from 'react';
import Budget from '../Components/budget/budgets';
import CategoryBudget from '../Components/budget/CategoryBudget';

const Budgets = () => {
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-dark-bg">
            <Budget />
            <CategoryBudget />
        </div>
    );
};

export default Budgets;