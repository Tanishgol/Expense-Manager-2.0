import React, { useState } from 'react'
import { PiggyBankIcon, TrendingUpIcon, TargetIcon, SquarePen, Trash2 } from 'lucide-react'
import GoalModal from '../modals/GoalModal'
import SavingsGoalService from '../../services/savingsGoalService'
import toast from 'react-hot-toast'

const iconMap = {
    Savings: <PiggyBankIcon className="h-6 w-6 text-indigo-600" />,
    Investment: <TrendingUpIcon className="h-6 w-6 text-green-600" />,
    Emergency: <TargetIcon className="h-6 w-6 text-blue-600" />,
}

const SavingsGoals = ({ goals = [], onGoalUpdate }) => {
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleEditGoal = (index) => {
        setSelectedGoal(goals[index])
        setEditIndex(index)
        setShowModal(true)
    }

    const handleDeleteGoal = async (goalId) => {
        try {
            setLoading(true)
            await SavingsGoalService.deleteGoal(goalId)
            toast.success('Goal deleted successfully')
            onGoalUpdate()
        } catch (error) {
            console.error('Error deleting goal:', error)
            toast.error('Failed to delete goal')
        } finally {
            setLoading(false)
        }
    }

    const handleModalSubmit = async (goal) => {
        try {
            setLoading(true)
            if (editIndex !== null) {
                // Update existing goal
                const updatedGoal = await SavingsGoalService.updateGoal(selectedGoal._id, {
                    name: goal.name,
                    description: goal.description,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    targetAmount: Number(goal.targetAmount),
                    monthlyContribution: Number(goal.monthlyContribution),
                })
                toast.success('Goal updated successfully')
            } else {
                // Create new goal (this should not happen here as it's handled in parent)
                toast.error('Goal creation is handled in the parent component')
            }
            setShowModal(false)
            setSelectedGoal(null)
            setEditIndex(null)
            onGoalUpdate()
        } catch (error) {
            console.error('Error saving goal:', error)
            toast.error('Failed to save goal')
        } finally {
            setLoading(false)
        }
    }

    const calculateProgress = (current, target) => {
        return (current / target) * 100
    }

    const calculateMonthsRemaining = (current, target, monthlyTarget) => {
        const remaining = target - current
        return Math.ceil(remaining / monthlyTarget)
    }

    const totalTarget = goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0)
    const totalCurrent = goals.reduce((sum, g) => sum + Number(g.current || 0), 0)
    const totalMonthlyContribution = goals.reduce((sum, g) => sum + Number(g.monthlyContribution || 0), 0)
    const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                        Savings Overview
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-lg dark:bg-gray-800">    
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Target</span>
                            <span className="font-semibold">${totalTarget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Saved</span>
                            <span className="font-semibold">${totalCurrent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Monthly Target</span>
                            <span className="font-semibold">${totalMonthlyContribution.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: `${overallProgress}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{overallProgress.toFixed(1)}% saved</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                        Savings Insights
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-5 dark:bg-gray-800">
                        <h3 className="font-medium text-blue-800 mb-3 dark:text-gray-200">
                            Progress Highlights
                        </h3>
                        {goals.length === 0 ? (
                            <div className="text-sm text-blue-700 dark:text-gray-300">
                                No savings goals have been created yet.
                            </div>
                        ) : (
                            <ul className="text-sm text-blue-700 space-y-2 dark:text-gray-300">
                                {goals.map((goal, index) => {
                                    const progress = calculateProgress(Number(goal.current || 0), Number(goal.targetAmount || 0))
                                    const monthsRemaining = calculateMonthsRemaining(
                                        Number(goal.current || 0), 
                                        Number(goal.targetAmount || 0), 
                                        Number(goal.monthlyContribution || 0)
                                    )
                                    return (
                                        <li key={goal._id || index}>
                                            • {goal.name} is {progress.toFixed(1)}% complete
                                            {monthsRemaining > 0 && ` (${monthsRemaining} months remaining)`}
                                        </li>
                                    )
                                })}
                                <li>• Total monthly savings target: ${totalMonthlyContribution.toLocaleString()}</li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>  

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                    Savings Goals
                </h2>   
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map((goal, index) => (
                        <div key={goal._id || index} className="bg-gray-50 p-5 rounded-lg dark:bg-gray-800">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">{iconMap[goal.category || goal.type] || <PiggyBankIcon className="h-6 w-6 text-indigo-600" />}</div>
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{goal.name}</h3>
                                        {goal.description && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">{goal.category || goal.type}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                                    <button
                                        onClick={() => handleEditGoal(index)}
                                        className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                    >
                                        <SquarePen className="w-4 h-4" />
                                        <span className="hidden xs:inline">Edit</span>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGoal(goal._id)}
                                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="hidden xs:inline">Delete</span>
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                                    <span className="text-sm font-medium dark:text-gray-200">
                                        ${Number(goal.current || 0).toLocaleString()} / ${Number(goal.targetAmount || 0).toLocaleString()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{
                                            width: `${calculateProgress(Number(goal.current || 0), Number(goal.targetAmount || 0))}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                    <span>0%</span>
                                    <span>{calculateProgress(Number(goal.current || 0), Number(goal.targetAmount || 0)).toFixed(1)}% complete</span>
                                    <span>100%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Monthly Contribution</span>
                                    <span className="font-medium dark:text-gray-200">${Number(goal.monthlyContribution || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Months Remaining</span>
                                    <span className="font-medium dark:text-gray-200">
                                        {calculateMonthsRemaining(
                                            Number(goal.current || 0), 
                                            Number(goal.targetAmount || 0), 
                                            Number(goal.monthlyContribution || 0)
                                        )} months
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                                    <span className="font-medium dark:text-gray-200">{goal.startDate ? new Date(goal.startDate).toLocaleDateString('en-GB').replaceAll('/', ' ') : '-'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">End Date</span>
                                    <span className="font-medium dark:text-gray-200">{goal.endDate ? new Date(goal.endDate).toLocaleDateString('en-GB').replaceAll('/', ' ') : '-'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <GoalModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialValues={selectedGoal || {}}
                submitButtonLabel={editIndex !== null ? 'Update Goal' : 'Create Goal'}
            />
        </div>
    )
}

export default SavingsGoals