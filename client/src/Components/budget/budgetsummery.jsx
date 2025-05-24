import React, { useState, useEffect } from 'react'
import CategoryBudget from './CategoryBudget'
import { useNavigate } from 'react-router-dom'
import PageTop from '../main/pagetop'
import BudgetService from '../../services/budgetService'
import toast from 'react-hot-toast'

export const BudgetSummary = () => {
    const navigate = useNavigate();
    const [budgetCategories, setBudgetCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchBudgetSummary()
    }, [])

    const fetchBudgetSummary = async () => {
        try {
            setIsLoading(true)
            const budgets = await BudgetService.getBudgetSummary()
            // Sort budgets by spent amount in descending order and take top 5
            const topBudgets = budgets
                .sort((a, b) => (b.spent || 0) - (a.spent || 0))
                .slice(0, 5)
            setBudgetCategories(topBudgets)
        } catch (error) {
            toast.error('Failed to fetch budget summary')
            console.error('Error fetching budget summary:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <>
            <PageTop />
            <div className="space-y-4">
                {budgetCategories.length === 0 ? (
                    <p className="text-gray-500 text-center">No budget data available</p>
                ) : (
                    <>
                        {budgetCategories.map((budget) => (
                            <CategoryBudget key={budget._id} budget={budget} />
                        ))}
                        <button
                            onClick={() => navigate('/budgets')}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            View All Categories
                        </button>
                    </>
                )}
            </div>
        </>
    )
}

export default BudgetSummary