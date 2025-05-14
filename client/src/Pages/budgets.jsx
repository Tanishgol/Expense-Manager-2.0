import React from 'react'
import Budget from '../Components/budget/budgets';
import BudgetSummary from '../Components/budget/budgetsummery';
import CategoryBudget from '../Components/budget/CategoryBudget';

const Budgets = () => {
    return (
        <>
            <Budget />
            <BudgetSummary />
            <CategoryBudget />
        </>
    )
}

export default Budgets;