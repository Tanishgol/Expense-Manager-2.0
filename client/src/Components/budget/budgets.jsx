import React, { useState } from 'react'
import CategoryBudget from './CategoryBudget'
import { PlusIcon } from 'lucide-react'
import { EditBudgetModal } from './editbudgetmodal'
import { ViewBudgetDetailsModal } from './viewbudgetdetailsModal'

const Budgets = () => {
    const [activeSection, setActiveSection] = useState('monthly')
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
        {
            category: 'Utilities',
            spent: 100,
            limit: 150,
            percentage: 67,
            color: 'bg-red-500',
        },
        {
            category: 'Healthcare',
            spent: 75,
            limit: 200,
            percentage: 37.5,
            color: 'bg-pink-500',
        },
        {
            category: 'Shopping',
            spent: 250,
            limit: 300,
            percentage: 83.3,
            color: 'bg-indigo-500',
        },
        {
            category: 'Personal Care',
            spent: 80,
            limit: 100,
            percentage: 80,
            color: 'bg-teal-500',
        },
    ]

    const handleEditBudget = (budget) => {
        setSelectedBudget(budget)
        setShowEditModal(true)
    }

    const handleViewDetails = (budget) => {
        setSelectedBudget(budget)
        setShowDetailsModal(true)
    }

    const handleUpdateBudget = (updatedBudget) => {
        console.log('Updating budget:', updatedBudget)
        setShowEditModal(false)
        setSelectedBudget(null)
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center">
                        <PlusIcon size={18} className="mr-1" />
                        <span>Add Budget</span>
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex space-x-6 border-b pb-2 mb-6">
                        <button
                            onClick={() => setActiveSection('monthly')}
                            className={`pb-3 px-2 ${activeSection === 'monthly'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Monthly Budgets
                        </button>
                        <button
                            onClick={() => setActiveSection('annual')}
                            className={`pb-3 px-2 ${activeSection === 'annual'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Annual Goals
                        </button>
                        <button
                            onClick={() => setActiveSection('savings')}
                            className={`pb-3 px-2 ${activeSection === 'savings'
                                ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Savings Goals
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Budget Overview
                            </h2>
                            <div className="bg-gray-50 p-5 rounded-lg mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total Budget</span>
                                    <span className="font-semibold">$3,200.00</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Total Spent</span>
                                    <span className="font-semibold">$2,545.00</span>
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-600">Remaining</span>
                                    <span className="font-semibold text-green-600">$655.00</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{
                                            width: '79.5%',
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-gray-500">0%</span>
                                    <span className="text-xs text-gray-500">79.5% spent</span>
                                    <span className="text-xs text-gray-500">100%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Budget Tips
                            </h2>
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                                <h3 className="font-medium text-blue-800 mb-3">
                                    Spending Insights
                                </h3>
                                <ul className="text-sm text-blue-700 space-y-2">
                                    <li>• Your Entertainment spending is over budget by 20%</li>
                                    <li>• Your Food spending is approaching the limit (84%)</li>
                                    <li>• You're on track with your Housing budget</li>
                                    <li>• You have $655 remaining for this month</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Category Budgets
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {budgetCategories.map((budget, index) => (
                                <div key={index} className="bg-gray-50 p-5 rounded-lg">
                                    <CategoryBudget budget={budget} />
                                    <div className="mt-4 flex justify-end space-x-3">
                                        <button
                                            onClick={() => handleEditBudget(budget)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleViewDetails(budget)}
                                            className="text-xs text-gray-500 hover:text-gray-700"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
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
        </>
    )
}

export default Budgets;