import React, { useState, useEffect, useRef } from 'react'
import ExpenseChart from './expensechart'
import IncomeExpenseChart from './incomeexpensechart'
import CategoryDistributionChart from './categorydistributionchart'
import { CalendarIcon, DownloadIcon, ChevronDownIcon } from 'lucide-react'

export const Report = () => {
    const [dateRange, setDateRange] = useState('month')
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [exportLoading, setExportLoading] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const exportMenuRef = useRef(null)
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
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    throw new Error('No authentication token found. Please log in.')
                }
                const response = await fetch('http://localhost:9000/api/transactions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                })
                
                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText} - ${errorData}`)
                }
                
                const data = await response.json()
                setTransactions(data)
                setLoading(false)
            } catch (err) {
                console.error('Error fetching transactions:', err)
                setError(err.message)
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [])

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

            const response = await fetch('http://localhost:9000/api/transactions/export', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    format,
                    dateRange,
                    transactions: transactions.filter(t => {
                        const transactionDate = new Date(t.date)
                        const now = new Date()
                        let startDate, endDate

                        switch (dateRange) {
                            case 'month':
                                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                                break
                            case 'quarter':
                                const quarter = Math.floor(now.getMonth() / 3)
                                startDate = new Date(now.getFullYear(), quarter * 3, 1)
                                endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0)
                                break
                            case 'year':
                                startDate = new Date(now.getFullYear(), 0, 1)
                                endDate = new Date(now.getFullYear(), 11, 31)
                                break
                            default:
                                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
                        }

                        return transactionDate >= startDate && transactionDate <= endDate
                    }),
                    summary
                })
            })

            if (!response.ok) throw new Error('Export failed')

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `financial-report-${dateRange}-${new Date().toISOString().split('T')[0]}.${format}`
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

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">Error: {error}</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
                <div className="relative" ref={exportMenuRef}>
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        disabled={exportLoading || !transactions.length}
                        className={`bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center ${
                            exportLoading || !transactions.length ? 'opacity-50 cursor-not-allowed' : ''
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
                                <span>Export Reports</span>
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Financial Overview
                    </h2>
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                            <button
                                onClick={() => setDateRange('month')}
                                className={`px-3 py-1 text-sm ${dateRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setDateRange('quarter')}
                                className={`px-3 py-1 text-sm ${dateRange === 'quarter' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Quarter
                            </button>
                            <button
                                onClick={() => setDateRange('year')}
                                className={`px-3 py-1 text-sm ${dateRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                Year
                            </button>
                        </div>
                        <button className="flex items-center border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>Custom</span>
                        </button>
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
                </div>
            </div>
        </div>
    )
}

export default Report