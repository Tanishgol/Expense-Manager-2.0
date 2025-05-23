import React, { useState } from 'react'
import CategoryBudget from './CategoryBudget'
import EditBudgetModal from './editbudgetmodal'
import ViewBudgetDetailsModal from './viewbudgetdetailsModal'

const MonthlyBudgets = () => {
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
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
    ]

    const handleUpdateBudget = (updatedBudget) => {
        // Here you would typically update the budget in your state management system
        console.log('Updated budget:', updatedBudget)
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
                    {budgetCategories.map((budget, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
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

            {selectedBudget && (
                <EditBudgetModal
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false)
                        setSelectedBudget(null)
                    }}
                    budget={selectedBudget}
                    onSubmit={handleUpdateBudget}
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