import React, { useState, useEffect } from 'react'
import { PlusIcon } from 'lucide-react'
import EditBudgetModal from './editbudgetmodal'
import ViewBudgetDetailsModal from './viewbudgetdetailsModal'
import MonthlyBudgets from './MonthlyBudgets'
import AnnualGoals from './annualgoals'
import SavingsGoals from './savingsgoals'
import BudgetService from '../../services/budgetService'
import GoalModal from '../modals/GoalModal';
import toast from 'react-hot-toast'

const Budgets = () => {
    const [activeSection, setActiveSection] = useState('monthly')
    const [selectedBudget, setSelectedBudget] = useState(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [budgets, setBudgets] = useState([])

    const fetchBudgets = async () => {
        try {
            setLoading(true)
            const data = await BudgetService.getAllBudgets()
            setBudgets(data)
        } catch (error) {
            // Keep showing loading state on error
            setLoading(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let ignore = false;
        let retryTimeout;

        const attemptFetch = async () => {
            if (!ignore) {
                await fetchBudgets()
                // Retry after 3 seconds if still loading
                retryTimeout = setTimeout(attemptFetch, 3000)
            }
        }

        attemptFetch()

        return () => {
            ignore = true
            if (retryTimeout) {
                clearTimeout(retryTimeout)
            }
        }
    }, [activeSection])

    const handleAddBudget = async (budgetData) => {
        try {
            setLoading(true)
            const newBudget = await BudgetService.createBudget({
                ...budgetData,
                type: activeSection
            })
            setBudgets(prev => [...prev, newBudget])
            toast.success('Budget created successfully')
            setShowAddModal(false)
        } catch (error) {
            // Keep showing loading state on error
            setLoading(true)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateBudget = async (updatedBudget) => {
        try {
            setLoading(true)
            const updated = await BudgetService.updateBudget(updatedBudget)
            setBudgets(prev => prev.map(budget =>
                budget._id === updated._id ? updated : budget
            ))
            toast.success('Budget updated successfully')
            setShowEditModal(false)
            setSelectedBudget(null)
        } catch (error) {
            // Keep showing loading state on error
            setLoading(true)
        } finally {
            setLoading(false)
        }
    }

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'monthly':
                return <MonthlyBudgets budgets={budgets.filter(b => b.type === 'monthly')} />
            case 'annual':
                return <AnnualGoals budgets={budgets.filter(b => b.type === 'annual')} />
            case 'savings':
                return <SavingsGoals budgets={budgets.filter(b => b.type === 'savings')} />
            default:
                return <MonthlyBudgets budgets={budgets.filter(b => b.type === 'monthly')} />
        }
    }

    const AddButton = () => (
        <button
            onClick={() => {
                if (activeSection === 'monthly') {
                    setShowAddModal(true);
                } else {
                    setIsModalOpen(true);
                }
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
        >
            <PlusIcon className="w-5 h-5" />
            <span>Add {activeSection === 'monthly' ? 'Budget' : 'Goal'}</span>
        </button>
    )

    return (
        <>
            <div className="space-y-6 mt-14">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Budget Management</h1>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                    <div className="flex justify-between items-center border-b pb-2 mb-6">
                        <div className="flex space-x-6">
                            <button
                                onClick={() => setActiveSection('monthly')}
                                className={`pb-3 px-2 ${activeSection === 'monthly'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-100'
                                    }`}
                            >
                                Monthly Budgets
                            </button>
                            <button
                                onClick={() => setActiveSection('annual')}
                                className={`pb-3 px-2 ${activeSection === 'annual'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-100'
                                    }`}
                            >
                                Annual Goals
                            </button>
                            <button
                                onClick={() => setActiveSection('savings')}
                                className={`pb-3 px-2 ${activeSection === 'savings'
                                    ? 'border-b-2 border-indigo-600 text-indigo-600 font-medium'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-100'
                                    }`}
                            >
                                Savings Goals
                            </button>
                        </div>

                        {(activeSection === 'annual' || activeSection === 'savings') && (
                            <AddButton />
                        )}
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

            <GoalModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={activeSection}
                onSubmit={(goalData) => {
                    console.log(goalData);
                    // TODO: Implement goal creation logic
                    setIsModalOpen(false);
                }}
            />
        </>
    )
}

export default Budgets;