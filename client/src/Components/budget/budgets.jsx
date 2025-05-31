import React, { useState, useEffect } from 'react'
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

    const handleUpdateBudget = (updatedBudget) => {
        setShowEditModal(false)
        setSelectedBudget(null)
    }

    const AddButton = () => (
        <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5" />
            <span>Add Budget</span>
        </button>
    )

    return (
        <>
            <div className="space-y-8">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800">Budget Management</h1>
                    <div>
                        {activeSection === 'annual' && <AddButton />}
                        {activeSection === 'savings' && <AddButton />}
                    </div>
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