import React, { useState, useEffect, useCallback } from 'react'
import CategoryBudget from './CategoryBudget'
import EditBudgetModal from './editbudgetmodal'
import ViewBudgetDetailsModal from './viewbudgetdetailsModal'
import BudgetService from '../../services/budgetService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AnnualGoalService from '../../services/annualGoalService'
import { TargetBudgetModal } from './targetbudgetmodal.jsx'
import ViewMessageModal from './viewmessagemodal'

const MonthlyBudgets = () => {
    const navigate = useNavigate()
    const { token } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [isEditingTotal, setIsEditingTotal] = useState(false)
    const [hasSetTotalBudget, setHasSetTotalBudget] = useState(false)
    const [showMessageModal, setShowMessageModal] = useState(false)
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [budgetCategories, setBudgetCategories] = useState([])
    const [annualGoals, setAnnualGoals] = useState([])
    const [allMessages, setAllMessages] = useState([])
    const [totalBudget, setTotalBudget] = useState(0)
    const [monthlyIncome, setMonthlyIncome] = useState(0)

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

    useEffect(() => {
        fetchAnnualGoals()
    }, [])

    const calculateMonthlyIncome = (transactions) => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const income = transactions
            .filter(t => {
                const transactionDate = new Date(t.date);
                return (
                    t.amount > 0 &&
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            })
            .reduce((total, t) => total + t.amount, 0);

        return income || 0;
    };

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
            const income = calculateMonthlyIncome(transactions);
            setMonthlyIncome(income);
            return transactions;
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setMonthlyIncome(0);
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
                    t.amount < 0 &&
                    transactionDate.getMonth() === currentMonth &&
                    transactionDate.getFullYear() === currentYear
                );
            })
            .reduce((total, t) => total + Math.abs(t.amount), 0);
    };

    const initializeBudgets = async () => {
        try {
            setIsLoading(true);

            const totalBudgetData = await BudgetService.getTotalBudget();
            if (totalBudgetData) {
                setTotalBudget(totalBudgetData.amount);
                setHasSetTotalBudget(true);
            }

            const budgets = await BudgetService.getAllBudgets('monthly');
            const transactions = await fetchTransactions();

            if (budgets.length === 0) {
                setHasSetTotalBudget(false);
                setBudgetCategories([]);
            } else {
                const updatedBudgets = budgets.map(budget => ({
                    ...budget,
                    spent: calculateCategorySpending(transactions, budget.category),
                    percentage: budget.limit > 0
                        ? (calculateCategorySpending(transactions, budget.category) / budget.limit) * 100
                        : 0
                }));

                const uniqueBudgets = updatedBudgets.reduce((acc, current) => {
                    const exists = acc.find(item => item.category === current.category);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                setBudgetCategories(uniqueBudgets);
            }
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again');
                navigate('/login');
            } else {
                toast.error('Failed to fetch budgets');
                console.error('Error fetching budgets:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

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
            const currentTotal = budgetCategories.reduce((sum, budget) => {
                if (budget._id === selectedBudget._id) {
                    return sum + updatedBudget.limit;
                }
                return sum + budget.limit;
            }, 0);

            if (currentTotal > totalBudget) {
                toast.error(`Total budget cannot exceed target budget of $${totalBudget.toLocaleString()}`);
                return;
            }

            await BudgetService.updateBudget(selectedBudget._id, {
                limit: updatedBudget.limit,
                color: updatedBudget.color
            });

            await initializeBudgets();
            window.dispatchEvent(new Event('budgetChange'));
            toast.success('Budget updated successfully');
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again');
                navigate('/login');
            } else {
                toast.error('Failed to update budget');
                console.error('Error updating budget:', error);
            }
        }
    };

    const handleAddBudget = async (budgetData) => {
        try {
            const currentTotal = budgetCategories.reduce((sum, budget) => sum + budget.limit, 0);
            const newTotal = currentTotal + budgetData.limit;

            if (newTotal > totalBudget) {
                toast.error(`Total budget cannot exceed target budget of $${totalBudget.toLocaleString()}`);
                return;
            }

            await BudgetService.createBudget({
                ...budgetData,
                type: 'monthly',
                color: 'bg-blue-500'
            });

            setShowAddModal(false);
            await initializeBudgets();
            window.dispatchEvent(new Event('budgetChange'));
            toast.success('Budget created successfully');
        } catch (error) {
            if (error.message === 'A budget for this category already exists') {
                toast.error('A budget for this category already exists');
            } else if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again');
                navigate('/login');
            } else {
                toast.error('Failed to create budget');
                console.error('Error creating budget:', error);
            }
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        try {
            await BudgetService.deleteBudget(budgetId);
            window.dispatchEvent(new Event('budgetChange'));
            toast.success('Budget deleted successfully');
            initializeBudgets();
        } catch (error) {
            if (error.message === 'Please authenticate') {
                toast.error('Session expired. Please login again');
                navigate('/login');
            } else {
                toast.error('Failed to delete budget');
                console.error('Error deleting budget:', error);
            }
        }
    };

    const fetchAnnualGoals = async () => {
        try {
            setIsLoading(true)
            const goals = await AnnualGoalService.getAllGoals()
            setAnnualGoals(goals || [])
        } catch (error) {
            console.error('Error fetching annual goals:', error)
            if (error.message === 'Please authenticate' || error.response?.status === 401) {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error(error.message || 'Failed to fetch annual goals')
            }
            setAnnualGoals([])
        } finally {
            setIsLoading(false)
        }
    }

    const calculateProgress = (current, target) => {
        if (!current || !target || target === 0) return 0
        return (current / target) * 100
    }

    const calculateTotalSpent = useCallback(() => {
        return budgetCategories.reduce((sum, budget) => sum + (budget.spent || 0), 0);
    }, [budgetCategories]);

    const getProgressHighlights = () => {
        const highlights = [];

        const budgetInsights = budgetCategories
            .filter(budget => budget.limit > 0)
            .map(budget => {
                const percentage = (budget.spent / budget.limit) * 100;
                let message = '';

                if (percentage >= 90) {
                    message = `⚠️ ${budget.category} budget is at ${percentage.toFixed(1)}% - Consider reducing spending`;
                } else if (percentage >= 75) {
                    message = `⚠️ ${budget.category} budget is at ${percentage.toFixed(1)}% - Watch your spending`;
                } else if (percentage >= 50) {
                    message = `📊 ${budget.category} budget is at ${percentage.toFixed(1)}% - On track`;
                }

                return {
                    title: budget.category,
                    progress: percentage,
                    status: percentage >= 90 ? 'critical' : percentage >= 75 ? 'warning' : 'info',
                    message,
                    type: 'budget'
                };
            })
            .filter(insight => insight.message !== '');

        highlights.push(...budgetInsights);

        if (annualGoals.length > 0) {
            const goalInsights = annualGoals.map(goal => {
                const progress = calculateProgress(goal.current, goal.target);
                const deadline = new Date(goal.deadline);
                const today = new Date();
                const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 +
                    (deadline.getMonth() - today.getMonth());

                let message = '';
                let status = '';

                if (progress >= 100) {
                    status = 'completed';
                    message = `🎉 ${goal.title} is completed!`;
                } else if (progress >= 75) {
                    status = 'almost complete';
                    message = `🎯 ${goal.title} is ${progress.toFixed(1)}% complete`;
                } else if (monthsRemaining <= 3 && progress < 75) {
                    status = 'needs increased savings';
                    const monthlyTarget = (goal.target - goal.current) / monthsRemaining;
                    message = `⚠️ ${goal.title} needs increased savings ($${monthlyTarget.toFixed(0)}/month to reach target)`;
                } else if (progress >= 50) {
                    status = 'on track';
                    message = `📈 ${goal.title} is on track for ${deadline.toLocaleDateString('en-US', { month: 'long' })} deadline`;
                } else {
                    status = 'needs attention';
                    const monthlyTarget = (goal.target - goal.current) / monthsRemaining;
                    message = `⚠️ ${goal.title} needs attention ($${monthlyTarget.toFixed(0)}/month needed)`;
                }

                return {
                    title: goal.title,
                    progress,
                    status,
                    message,
                    type: 'goal'
                };
            });

            highlights.push(...goalInsights);
        }

        const totalSpent = calculateTotalSpent();
        const totalBudget = budgetCategories.reduce((sum, budget) => sum + budget.limit, 0);
        const overallProgress = (totalBudget > 0) ? (totalSpent / totalBudget) * 100 : 0;

        if (totalBudget > 0) {
            let trendMessage = '';
            if (overallProgress >= 90) {
                trendMessage = `⚠️ Overall spending is at ${overallProgress.toFixed(1)}% of monthly budget - Consider reducing expenses`;
            } else if (overallProgress >= 75) {
                trendMessage = `📊 Overall spending is at ${overallProgress.toFixed(1)}% of monthly budget - Watch your expenses`;
            } else if (overallProgress >= 50) {
                trendMessage = `📈 Overall spending is at ${overallProgress.toFixed(1)}% of monthly budget - On track`;
            }

            if (trendMessage) {
                highlights.push({
                    title: 'Overall Spending',
                    progress: overallProgress,
                    status: overallProgress >= 90 ? 'critical' : overallProgress >= 75 ? 'warning' : 'info',
                    message: trendMessage,
                    type: 'trend'
                });
            }
        }

        // Add default message if no highlights are present
        if (highlights.length === 0) {
            highlights.push({
                title: 'No Active Insights',
                progress: 0,
                status: 'info',
                message: '📊 Your budgets and goals are all in good shape! Keep up the good work!',
                type: 'default'
            });
        }

        return highlights.sort((a, b) => {
            const priority = { critical: 0, warning: 1, info: 2 };
            return priority[a.status] - priority[b.status];
        });
    };

    useEffect(() => {
        const highlights = getProgressHighlights();
        setAllMessages(highlights);
    }, [budgetCategories, annualGoals, calculateTotalSpent]);

    const handleTargetUpdated = async (newTotal) => {
        setTotalBudget(newTotal);
        setHasSetTotalBudget(true);
        await initializeBudgets();
        window.dispatchEvent(new Event('budgetChange'));
    };

    const calculateProgressPercentage = () => {
        const spent = calculateTotalSpent();
        if (totalBudget <= 0) return 0;
        const percentage = (spent / totalBudget) * 100;
        return Math.min(percentage, 100);
    };

    const calculateRemainingIncome = () => {
        const spent = calculateTotalSpent();
        return Math.max(monthlyIncome - spent, 0);
    };

    const calculateRemainingBudget = () => {
        const spent = calculateTotalSpent();
        return Math.max(totalBudget - spent, 0);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    const progressHighlights = getProgressHighlights()

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                            Monthly Goals Overview
                        </h2>

                        {monthlyIncome > 0 ? (
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded transition duration-200"
                                onClick={() => {
                                    setIsEditingTotal(true);
                                    setIsTargetModalOpen(true);
                                }}
                            >
                                {totalBudget > 0 ? 'Edit Total Budget' : 'Set Total Budget'}
                            </button>
                        ) : (
                            <div className="text-sm text-red-600">
                                No income recorded for this month
                            </div>
                        )}
                    </div>


                    <div className="bg-gray-50 p-5 rounded-lg">
                        {monthlyIncome > 0 ? (
                            <>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total Income</span>
                                    <span className="font-semibold">${monthlyIncome.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total Target Budget of Spending</span>
                                    <span className="font-semibold text-green-600">
                                        ${Math.min(totalBudget, monthlyIncome).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Remaining Budget</span>
                                    <span className="font-semibold">${calculateRemainingBudget().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total Spent</span>
                                    <span className="font-semibold">${calculateTotalSpent().toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div
                                        className={`h-2 rounded-full ${calculateProgressPercentage() > 100 ? 'bg-red-600' : 'bg-indigo-600'}`}
                                        style={{
                                            width: `${totalBudget > 0
                                                ? calculateProgressPercentage()
                                                : Math.min((calculateTotalSpent() / monthlyIncome) * 100, 100)}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">0%</span>
                                    <span className="text-xs text-gray-500">
                                        {totalBudget > 0
                                            ? (calculateProgressPercentage() > 100
                                                ? `${Math.round(calculateProgressPercentage())}% (Over Budget)`
                                                : `${Math.round(calculateProgressPercentage())}% spent`)
                                            : `${Math.round((calculateTotalSpent() / monthlyIncome) * 100)}% spent`}
                                    </span>
                                    <span className="text-xs text-gray-500">100%</span>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600 mb-2">No income recorded for this month</p>
                                <p className="text-sm text-gray-500">Add income transactions to set your monthly budget</p>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Monthly Insights
                        </h2>
                        <button
                            onClick={() => setShowMessageModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded transition duration-200"
                        >
                            View all messages
                        </button>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                        <h3 className="font-medium text-blue-800 mb-3">
                            Progress Highlights
                        </h3>
                        {progressHighlights.length > 0 ? (
                            <ul className="text-sm text-blue-700 space-y-2">
                                {progressHighlights.slice(0, 5).map((insight, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-2">•</span>
                                        <span
                                            className={`font-semibold ${insight.status === 'critical'
                                                ? 'text-red-600'
                                                : insight.status === 'warning'
                                                    ? 'text-orange-600'
                                                    : 'text-blue-700'
                                                }`}
                                        >
                                            {insight.message}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-blue-700">
                                No insights available yet. Start by setting up your budgets and goals!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {hasSetTotalBudget && monthlyIncome > 0 ? (
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Monthly Budget Categories
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {budgetCategories.map((budget) => (
                            <div key={budget._id} className="bg-gray-50 p-4 rounded-lg">
                                <CategoryBudget budget={budget} />
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => {
                                            setSelectedBudget(budget);
                                            setShowEditModal(true);
                                        }}
                                        className="text-xs text-indigo-600 hover:text-indigo-800 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedBudget(budget);
                                            setShowDetailsModal(true);
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
            ) : monthlyIncome > 0 ? (
                <div className="mt-10 text-center p-8 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Set Your Monthly Budget First</h3>
                    <p className="text-gray-600 mb-4">Please set your total monthly budget before managing individual categories.</p>
                    <button
                        onClick={() => {
                            setIsEditingTotal(false);
                            setIsTargetModalOpen(true);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Set Monthly Budget
                    </button>
                </div>
            ) : (
                <div className="mt-10 text-center p-8 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Income Recorded</h3>
                    <p className="text-gray-600 mb-4">Please add income transactions for this month before setting up your budget.</p>
                </div>
            )}

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
                    totalBudget={totalBudget}
                    currentTotal={budgetCategories.reduce((sum, budget) => sum + budget.limit, 0)}
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
                    totalBudget={totalBudget}
                    currentTotal={budgetCategories.reduce((sum, budget) => sum + budget.limit, 0)}
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

            <TargetBudgetModal
                isOpen={isTargetModalOpen}
                onClose={() => {
                    setIsTargetModalOpen(false);
                    setIsEditingTotal(false);
                }}
                initialValue={totalBudget}
                monthlyIncome={monthlyIncome}
                onTargetUpdated={handleTargetUpdated}
                isEditing={isEditingTotal}
            />

            <ViewMessageModal
                isOpen={showMessageModal}
                onClose={() => setShowMessageModal(false)}
                messages={allMessages}
            />
        </div>
    )
}

export default MonthlyBudgets