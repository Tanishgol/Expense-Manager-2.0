import React, { useState, useEffect } from 'react'
import CategoryBudget from './CategoryBudget'
import EditBudgetModal from './editbudgetmodal'
import ViewBudgetDetailsModal from './viewbudgetdetailsModal'
import BudgetService from '../../services/budgetService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const MonthlyBudgets = () => {
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [budgetCategories, setBudgetCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const [showAddModal, setShowAddModal] = useState(false)
    const { token } = useAuth()

    const defaultCategories = [
        'Food',
        'Housing',
        'Transportation',
        'Utilities',
        'Healthcare',
        'Entertainment',
        'Shopping',
        'Personal Care',
        'Other'
    ]

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Please login to view budgets')
            navigate('/login')
            return
        }
        initializeBudgets()
    }, [navigate])

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const transactions = await response.json();
            return transactions;
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

    const initializeBudgets = async () => {
        try {
            setIsLoading(true)
            const budgets = await BudgetService.getAllBudgets('monthly')
            const transactions = await fetchTransactions()

            // If no budgets exist, create default budgets
            if (budgets.length === 0) {
                // Create default budgets one by one to ensure no duplicates
                for (const category of defaultCategories) {
                    try {
                        const spent = calculateCategorySpending(transactions, category);
                        await BudgetService.createBudget({
                            category,
                            limit: 0,
                            type: 'monthly',
                            color: 'bg-blue-500',
                            spent
                        })
                    } catch (error) {
                        // Skip if budget already exists
                        if (error.message !== 'A budget for this category already exists') {
                            throw error
                        }
                    }
                }
                // Fetch all budgets after creation
                const updatedBudgets = await BudgetService.getAllBudgets('monthly')
                setBudgetCategories(updatedBudgets)
            } else {
                // Update spent amounts based on transactions
                const updatedBudgets = budgets.map(budget => ({
                    ...budget,
                    spent: calculateCategorySpending(transactions, budget.category),
                    percentage: budget.limit > 0
                        ? (calculateCategorySpending(transactions, budget.category) / budget.limit) * 100
                        : 0
                }));

                // Filter out any duplicate categories, keeping only the first occurrence
                const uniqueBudgets = updatedBudgets.reduce((acc, current) => {
                    const exists = acc.find(item => item.category === current.category)
                    if (!exists) {
                        acc.push(current)
                    }
                    return acc
                }, [])
                setBudgetCategories(uniqueBudgets)
            }
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error('Failed to fetch budgets')
                console.error('Error fetching budgets:', error)
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Add event listener for transaction changes
    useEffect(() => {
        const handleTransactionChange = () => {
            initializeBudgets()
        }

        window.addEventListener('transactionChange', handleTransactionChange)
        return () => {
            window.removeEventListener('transactionChange', handleTransactionChange)
        }
    }, [])

    const handleUpdateBudget = async (updatedBudget) => {
        try {
            await BudgetService.updateBudget(selectedBudget._id, {
                limit: updatedBudget.limit,
                color: updatedBudget.color
            })
            toast.success('Budget updated successfully')
            initializeBudgets()
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error('Failed to update budget')
                console.error('Error updating budget:', error)
            }
        }
    }

    const handleAddBudget = async (budgetData) => {
        try {
            await BudgetService.createBudget({
                ...budgetData,
                type: 'monthly',
                color: 'bg-blue-500'
            })
            toast.success('Budget created successfully')
            setShowAddModal(false)
            initializeBudgets()
        } catch (error) {
            if (error.message === 'A budget for this category already exists') {
                toast.error('A budget for this category already exists')
            } else if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error('Failed to create budget')
                console.error('Error creating budget:', error)
            }
        }
    }

    const handleDeleteBudget = async (budgetId) => {
        try {
            await BudgetService.deleteBudget(budgetId)
            toast.success('Budget deleted successfully')
            initializeBudgets()
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error('Failed to delete budget')
                console.error('Error deleting budget:', error)
            }
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Annual Goals Overview
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Total Target</span>
                            <span className="font-semibold">$50,000.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Total Saved</span>
                            <span className="font-semibold">$27,500.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-semibold text-green-600">$22,500.00</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: '55%',
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs text-gray-500">55% saved</span>
                            <span className="text-xs text-gray-500">100%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Goal Insights
                    </h2>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                        <h3 className="font-medium text-blue-800 mb-3">
                            Progress Highlights
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Emergency Fund is 75% complete</li>
                            <li>• Vacation Fund is on track for June deadline</li>
                            <li>• Home Renovation needs increased savings</li>
                            <li>• New Car Fund is 60% complete</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Monthly Budget Categories
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgetCategories.map((budget) => (
                        <div key={budget._id} className="bg-gray-50 p-4 rounded-lg">
                            <CategoryBudget budget={budget} />
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => {
                                        setSelectedBudget(budget)
                                        setShowEditModal(true)
                                    }}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 mr-3"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setSelectedBudget(budget)
                                        setShowDetailsModal(true)
                                    }}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showAddModal && (
                <EditBudgetModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    budget={{
                        category: '',
                        limit: 0,
                        spent: 0,
                        percentage: 0,
                        color: 'bg-blue-500'
                    }}
                    onSubmit={handleAddBudget}
                    existingCategories={budgetCategories.map(b => b.category)}
                />
            )}

            {selectedBudget && (
                <EditBudgetModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedBudget(null)
                    }}
                    budget={selectedBudget}
                    onSubmit={handleUpdateBudget}
                    existingCategories={budgetCategories.map(b => b.category)}
                />
            )}

            {selectedBudget && (
                <ViewBudgetDetailsModal
                    isOpen={showDetailsModal}
                    onClose={() => {
                        setShowDetailsModal(false)
                        setSelectedBudget(null)
                    }}
                    budget={selectedBudget}
                />
            )}
        </div>
    )
}

export default MonthlyBudgets