import React, { useState, useEffect, useCallback } from 'react';
import CategoryBudget from './CategoryBudget';
import { useNavigate } from 'react-router-dom';
import PageTop from '../main/pagetop';
import BudgetService from '../../services/budgetService';
import toast from 'react-hot-toast';

export const BudgetSummary = () => {
    const navigate = useNavigate();
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
    };

    const calculateCategorySpending = (transactions, category) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        return transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return (
                    t.category === category &&
                    t.amount < 0 && // Only expenses
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            })
            .reduce((total, t) => total + Math.abs(t.amount), 0);
    };

    const fetchBudgetSummary = useCallback(async () => {
        setIsLoading(true);
        try {
            const budgets = await BudgetService.getAllBudgets('monthly');
            const transactions = await fetchTransactions();

            const updatedBudgets = budgets.map(budget => {
                const spent = calculateCategorySpending(transactions, budget.category);
                return {
                    ...budget,
                    spent,
                    percentage: budget.limit > 0 ? (spent / budget.limit) * 100 : 0
                };
            });

            const uniqueBudgets = updatedBudgets.filter(
                (budget, index, self) =>
                    index === self.findIndex(
                        (b) => b.category.toLowerCase() === budget.category.toLowerCase()
                    )
            );

            const topBudgets = uniqueBudgets
                .sort((a, b) => (b.spent || 0) - (a.spent || 0))
                .slice(0, 3);

            setBudgetCategories(topBudgets);
        } catch (error) {
            toast.error('Failed to fetch budget summary');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBudgetSummary();

        const handleBudgetChange = () => fetchBudgetSummary();
        const handleTransactionChange = () => fetchBudgetSummary();

        window.addEventListener('budgetChange', handleBudgetChange);
        window.addEventListener('transactionChange', handleTransactionChange);

        return () => {
            window.removeEventListener('budgetChange', handleBudgetChange);
            window.removeEventListener('transactionChange', handleTransactionChange);
        };
    }, [fetchBudgetSummary]);

    return (
        <>
            <PageTop />
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : budgetCategories.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-300 text-center">No budget data available</p>
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
    );
};

export default BudgetSummary;