import React, { useState } from 'react'
import CategoryBudget from './CategoryBudget'
import { PlusIcon } from 'lucide-react'
import EditBudgetModal from './editbudgetmodal'
import ViewBudgetDetailsModal from './viewbudgetdetailsModal'
import MonthlyBudgets from './MonthlyBudgets'
import AnnualGoals from './annualgoals'
import SavingsGoals from './savingsgoals'
import BudgetService from '../../services/budgetService'
import toast from 'react-hot-toast'

const Budgets = () => {
    const [activeSection, setActiveSection] = useState('monthly')
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)

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

    const handleAddBudget = async (budgetData) => {
        try {
            await BudgetService.createBudget({
                ...budgetData,
                type: activeSection
            })
            toast.success('Budget created successfully')
            setShowAddModal(false)
        } catch (error) {
            toast.error('Failed to create budget')
            console.error('Error creating budget:', error)
        }
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'monthly':
                return <MonthlyBudgets />
            case 'annual':
                return <AnnualGoals />
            case 'savings':
                return <SavingsGoals />
            default:
                return <MonthlyBudgets />
        }
    }

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
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center"
                    >
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

                    {renderActiveSection()}
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