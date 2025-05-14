import React, { useState } from 'react'
import ExpenseChart from './expensechart'
import IncomeExpenseChart from './incomeexpensechart'
import CategoryDistributionChart from './categorydistributionchart'
import { CalendarIcon, DownloadIcon } from 'lucide-react'
export const Report = () => {
    const [dateRange, setDateRange] = useState('month')
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Financial Reports</h1>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center">
                    <DownloadIcon size={18} className="mr-1" />
                    <span>Export Reports</span>
                </button>
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
                            <IncomeExpenseChart dateRange={dateRange} />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            Expense Trend
                        </h3>
                        <div className="h-64">
                            <ExpenseChart dateRange={dateRange} />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            Spending by Category
                        </h3>
                        <div className="h-80">
                            <CategoryDistributionChart />
                        </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-md font-medium text-gray-700 mb-4">Summary</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Income</p>
                                <p className="text-xl font-semibold text-green-600">
                                    $3,550.00
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                                <p className="text-xl font-semibold text-red-600">$2,140.00</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Net Savings</p>
                                <p className="text-xl font-semibold text-indigo-600">
                                    $1,410.00
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Savings Rate</p>
                                <p className="text-xl font-semibold text-blue-600">39.7%</p>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600 mb-1">
                                    Top Expense Category
                                </p>
                                <p className="font-medium">
                                    Housing <span className="text-red-600">$1,200.00</span>
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Most Growth</p>
                                <p className="font-medium">
                                    Utilities <span className="text-red-600">+15.2%</span>
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