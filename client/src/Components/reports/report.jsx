import React, { useState, useEffect, useRef } from 'react'
import ExpenseChart from './expensechart'
import IncomeExpenseChart from './incomeexpensechart'
import CategoryDistributionChart from './categorydistributionchart'
import { DownloadIcon, ChevronDownIcon } from 'lucide-react'
import AnnualGoalService from '../../services/annualGoalService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const Report = () => {
    const [dateRange, setDateRange] = useState('month')
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [exportLoading, setExportLoading] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const exportMenuRef = useRef(null)
    const [annualGoals, setAnnualGoals] = useState([])
    const navigate = useNavigate()
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        savingsRate: 0,
        topExpenseCategory: { category: '', amount: 0 }
    })

    // Close export menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
                setShowExportMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No authentication token found. Please log in.')
                }

                // Fetch transactions
                const transactionsResponse = await fetch('http://localhost:9000/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })

                if (!transactionsResponse.ok) {
                    throw new Error('Failed to fetch transactions')
                }

                const transactionsData = await transactionsResponse.json()
                setTransactions(transactionsData)

                // Fetch annual goals
                const goals = await AnnualGoalService.getAllGoals()
                setAnnualGoals(goals || [])
            } catch (error) {
                console.error('Error fetching data:', error)
                if (error.message === 'Please authenticate' || error.response?.status === 401) {
                    toast.error('Session expired. Please login again')
                    navigate('/login')
                } else {
                    setError(error.message || 'Failed to fetch data')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [navigate])

    useEffect(() => {
        if (transactions.length > 0) {
            const now = new Date()
            let startDate, endDate

            // Set date range based on selection
            switch (dateRange) {
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
                    break
                case 'quarter':
                    const quarter = Math.floor(now.getMonth() / 3)
                    startDate = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0)
                    endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59)
                    break
                case 'year':
                    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0)
                    endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
                    break
                default:
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)
                    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
            }

            // Filter transactions within the date range
            const filteredTransactions = transactions.filter(t => {
                const transactionDate = new Date(t.date)
                return transactionDate >= startDate && transactionDate <= endDate
            })

            // Calculate totals
            const totalIncome = filteredTransactions
                .filter(t => t.amount > 0)
                .reduce((sum, t) => sum + t.amount, 0)

            const totalExpenses = filteredTransactions
                .filter(t => t.amount < 0)
                .reduce((sum, t) => sum + Math.abs(t.amount), 0)

            const netSavings = totalIncome - totalExpenses
            const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0

            // Find top expense category
            const expensesByCategory = filteredTransactions
                .filter(t => t.amount < 0)
                .reduce((acc, t) => {
                    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount)
                    return acc
                }, {})

            const topExpenseCategory = Object.entries(expensesByCategory)
                .reduce((max, [category, amount]) =>
                    amount > max.amount ? { category, amount } : max,
                    { category: '', amount: 0 }
                )

            setSummary({
                totalIncome,
                totalExpenses,
                netSavings,
                savingsRate,
                topExpenseCategory
            })
        }
    }, [transactions, dateRange])

    const handleExport = async (format) => {
        if (!transactions.length) return

        setExportLoading(true)
        setShowExportMenu(false)

        try {
            const token = localStorage.getItem('token')
            if (!token) throw new Error('No authentication token found')

            const response = await fetch(`http://localhost:9000/api/transactions/export?format=${format}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `transactions-${new Date().toISOString().split('T')[0]}.${format}`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        } catch (error) {
            console.error('Export error:', error)
            alert('Failed to export report. Please try again.')
        } finally {
            setExportLoading(false)
        }
    }

    const calculateGoalProgress = (current, target) => {
        if (!current || !target || target === 0) return 0
        return (current / target) * 100
    }

    const getGoalInsights = () => {
        if (!annualGoals.length) return []

        return annualGoals.map(goal => {
            const progress = calculateGoalProgress(goal.current, goal.target)
            const deadline = new Date(goal.deadline)
            const today = new Date()
            const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 +
                (deadline.getMonth() - today.getMonth())

            let status = ''
            let message = ''

            if (progress >= 100) {
                status = 'completed'
                message = `${goal.title} is completed`
            } else if (progress >= 75) {
                status = 'almost complete'
                message = `${goal.title} is ${progress.toFixed(1)}% complete`
            } else if (monthsRemaining <= 3 && progress < 75) {
                status = 'needs increased savings'
                const monthlyTarget = (goal.target - goal.current) / monthsRemaining
                message = `${goal.title} needs increased savings ($${monthlyTarget.toFixed(0)}/month to reach target)`
            } else if (progress >= 50) {
                status = 'on track'
                message = `${goal.title} is on track for ${deadline.toLocaleDateString('en-US', { month: 'long' })} deadline`
            } else {
                status = 'needs attention'
                const monthlyTarget = (goal.target - goal.current) / monthsRemaining
                message = `${goal.title} needs attention ($${monthlyTarget.toFixed(0)}/month needed)`
            }

            return {
                title: goal.title,
                progress,
                status,
                message,
                deadline: goal.deadline
            }
        })
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center xs:mt-14 xss:mt-14 xsss:mt-14">
                <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
                <div className="relative" ref={exportMenuRef}>
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={exportLoading || !transactions.length}
                        className={`bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center ${exportLoading || !transactions.length ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {exportLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                                <span>Exporting...</span>
                            </>
                        ) : (
                            <>
                                <DownloadIcon size={18} className="mr-1" />
                                <span className='xs:text-sm xss:text-sm xsss:text-sm'>Export Reports</span>
                                <ChevronDownIcon size={16} className="ml-1" />
                            </>
                        )}
                    </button>
                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                                <button
                                    onClick={() => handleExport('pdf')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => handleExport('csv')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Download CSV
                                </button>
                                <button
                                    onClick={() => handleExport('xlsx')}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Download Excel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-col xsss:flex-col xs:flex-row justify-between items-center mb-6 gap-3 xs:gap-2">
                    <h2 className="text-lg font-semibold text-gray-800 text-center xs:text-left xsss:mb-2">
                        Financial Overview
                    </h2>

                    <div className="flex items-center justify-center w-full xs:w-auto">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={() => setDateRange('month')}
                                className={`px-3 py-1 text-sm transition-colors duration-150 ${dateRange === 'month'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setDateRange('quarter')}
                                className={`px-3 py-1 text-sm transition-colors duration-150 ${dateRange === 'quarter'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Quarter
                            </button>
                            <button
                                onClick={() => setDateRange('year')}
                                className={`px-3 py-1 text-sm transition-colors duration-150 ${dateRange === 'year'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                Year
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            Income vs Expenses
                        </h3>
                        <div className="h-64">
                            <IncomeExpenseChart dateRange={dateRange} transactions={transactions} />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            Expense Trend
                        </h3>
                        <div className="h-64">
                            <ExpenseChart dateRange={dateRange} transactions={transactions} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            Spending by Category
                        </h3>
                        <div className="h-80">
                            <CategoryDistributionChart transactions={transactions} dateRange={dateRange} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-md font-medium text-gray-700 mb-4">Summary</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Income</p>
                                    <p className="text-xl font-semibold text-green-600">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(summary.totalIncome)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                                    <p className="text-xl font-semibold text-red-600">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(summary.totalExpenses)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Net Savings</p>
                                    <p className={`text-xl font-semibold ${summary.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(summary.netSavings)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                                    <p className="text-xl font-semibold text-blue-600">
                                        {summary.savingsRate.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-600 mb-1">
                                        Top Expense Category
                                    </p>
                                    <p className="font-medium">
                                        {summary.topExpenseCategory.category}: {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD'
                                        }).format(summary.topExpenseCategory.amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {annualGoals.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-md font-medium text-gray-700 mb-4">Goal Insights</h3>
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-800 mb-3">
                                        Progress Highlights
                                    </h4>
                                    <ul className="text-sm text-blue-700 space-y-2">
                                        {getGoalInsights().map((insight, index) => (
                                            <li key={index} className="flex items-start">
                                                <span className="mr-2">•</span>
                                                <span>{insight.message}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Report