import React, { useState, useEffect } from 'react'
import { CalendarIcon, TargetIcon, TrendingUpIcon, SquarePen, Trash2, DollarSign } from 'lucide-react'
import GoalModal from '../modals/GoalModal'
import ContributionModal from '../modals/ContributionModal'
import AnnualGoalService from '../../services/annualGoalService'
import IncomeService from '../../services/incomeService'
import toast from 'react-hot-toast'

const iconMap = {
    Savings: <TargetIcon className="h-6 w-6 text-indigo-600" />,
    Investment: <TrendingUpIcon className="h-6 w-6 text-green-600" />,
    Income: <CalendarIcon className="h-6 w-6 text-blue-600" />,
}

const AnnualGoals = ({ goals = [], onGoalUpdate }) => {
    const [showModal, setShowModal] = useState(false)
    const [showContributionModal, setShowContributionModal] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [hasCurrentMonthIncome, setHasCurrentMonthIncome] = useState(false)

    useEffect(() => {
        checkCurrentMonthIncome();
    }, []);

    const checkCurrentMonthIncome = async () => {
        try {
            const hasIncome = await IncomeService.hasCurrentMonthIncome();
            setHasCurrentMonthIncome(hasIncome);
        } catch (error) {
            console.error('Error checking current month income:', error);
        }
    };

    const handleEditGoal = (index) => {
        setSelectedGoal(goals[index])
        setEditIndex(index)
        setShowModal(true)
    }

    const handleDeleteGoal = async (goalId) => {
        try {
            setLoading(true)
            await AnnualGoalService.deleteGoal(goalId)
            toast.success('Goal deleted successfully')
            onGoalUpdate()
        } catch (error) {
            console.error('Error deleting goal:', error)
            toast.error('Failed to delete goal')
        } finally {
            setLoading(false)
        }
    }

    const handleContributeClick = (goal) => {
        setSelectedGoal(goal);
        setShowContributionModal(true);
    };

    const handleContributionSuccess = (updatedGoal, incomeSummary) => {
        // Update the goal in the local state
        const goalIndex = goals.findIndex(g => g._id === updatedGoal._id);
        if (goalIndex !== -1) {
            const updatedGoals = [...goals];
            updatedGoals[goalIndex] = updatedGoal;
            // Trigger parent update
            onGoalUpdate();
        }
        // Re-check income status
        checkCurrentMonthIncome();
    };

    const handleModalSubmit = async (goal) => {
        try {
            setLoading(true)
            if (editIndex !== null) {
                // Update existing goal
                const updatedGoal = await AnnualGoalService.updateGoal(selectedGoal._id, {
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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Annual Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                        Annual Overview
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-lg dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Target</span>
                            <span className="font-semibold">${goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Saved</span>
                            <span className="font-semibold">${goals.reduce((sum, g) => sum + Number(g.current || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Goals</span>
                            <span className="font-semibold">{goals.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: `${(
                                        goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                        (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)
                                    ) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {(
                                    goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                    (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)
                                ) * 100
                                    ? ((goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                        (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)) * 100).toFixed(1)
                                    : 0
                                }% saved
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 dark:text-gray-200">
                        Annual Insights
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-5 dark:bg-gray-800">
                        <h3 className="font-medium text-blue-800 mb-3 dark:text-gray-200">
                            Progress Highlights
                        </h3>
                        <div className="bg-gray-50 rounded-lg dark:bg-gray-800">
                            {goals.length === 0 || goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) === 0 ? (
                                <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400 text-sm text-center">
                                    No goal data has been recorded yet.
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Target</span>
                                        <span className="font-semibold">
                                            ${goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Saved</span>
                                        <span className="font-semibold">
                                            ${goals.reduce((sum, g) => sum + Number(g.current || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Goals</span>
                                        <span className="font-semibold">{goals.length}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{
                                                width: `${(
                                                    goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                    (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)
                                                ) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {(
                                                goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)
                                            ) * 100
                                                ? (
                                                    (goals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                        (goals.reduce((sum, g) => sum + Number(g.targetAmount || 0), 0) || 1)) *
                                                    100
                                                ).toFixed(1)
                                                : 0}
                                            % saved
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">100%</span>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            {/* End Annual Overview Section */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Annual Goals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map((goal, index) => (
                    <div key={goal._id || index} className="bg-gray-50 p-5 rounded-2xl hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">{iconMap[goal.category || goal.type] || <TargetIcon className="h-6 w-6 text-indigo-600" />}</div>
                                <div className="ml-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium text-gray-800 dark:text-gray-200">{goal.name}</h3>
                                        {goal.startDate && goal.endDate && (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
                                            </span>
                                        )}
                                    </div>
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
                                    ${Number(goal.current ?? 0).toLocaleString()} / ${Number(goal.targetAmount ?? 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                    style={{ width: `${calculateProgress(Number(goal.current ?? 0), Number(goal.targetAmount ?? 0))}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                                <span>0%</span>
                                <span>{isNaN(calculateProgress(Number(goal.current ?? 0), Number(goal.targetAmount ?? 0))) ? 0 : calculateProgress(Number(goal.current ?? 0), Number(goal.targetAmount ?? 0)).toFixed(1)}% complete</span>
                                <span>100%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Start Date</span>
                                <span className="font-medium dark:text-gray-200">{formatDate(goal.startDate)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">End Date</span>
                                <span className="font-medium dark:text-gray-200">{formatDate(goal.endDate)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Monthly Contribution</span>
                                <span className="font-medium dark:text-gray-200">${Number(goal.monthlyContribution ?? 0).toLocaleString()}</span>
                            </div>
                            
                            {/* Contribution Button */}
                            {hasCurrentMonthIncome && (
                                <button
                                    onClick={() => handleContributeClick(goal)}
                                    className="w-full mt-4 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-indigo-300 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-700 dark:hover:bg-indigo-900/30 flex items-center justify-center gap-2"
                                >
                                    <DollarSign className="w-4 h-4" />
                                    Contribute from Salary
                                </button>
                            )}
                            {!hasCurrentMonthIncome && (
                                <div className="w-full mt-4 px-4 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600 flex items-center justify-center gap-2 cursor-not-allowed">
                                    <DollarSign className="w-4 h-4" />
                                    Add Income to Contribute
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <GoalModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialValues={selectedGoal || {}}
                submitButtonLabel={editIndex !== null ? 'Update Goal' : 'Create Goal'}
            />
            <ContributionModal
                isOpen={showContributionModal}
                onClose={() => setShowContributionModal(false)}
                goal={selectedGoal}
                goalType="annual"
                onContributionSuccess={handleContributionSuccess}
            />
        </div>
    )
}

export default AnnualGoals