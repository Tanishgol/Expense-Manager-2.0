import React, { useState, useEffect } from 'react'
import { CalendarIcon, TargetIcon, TrendingUpIcon, SquarePen, Trash2 } from 'lucide-react'
import GoalModal from '../modals/GoalModal'
import AnnualGoalService from '../../services/annualGoalService'
import toast from 'react-hot-toast'

const iconMap = {
    Savings: <TargetIcon className="h-6 w-6 text-indigo-600" />,
    Investment: <TrendingUpIcon className="h-6 w-6 text-green-600" />,
    Income: <CalendarIcon className="h-6 w-6 text-blue-600" />,
}

const AnnualGoals = () => {
    const [annualGoals, setAnnualGoals] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    const [selectedGoal, setSelectedGoal] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchGoals()
    }, [])

    const fetchGoals = async () => {
        try {
            setLoading(true)
            const data = await AnnualGoalService.getAllGoals()
            setAnnualGoals(data)
        } catch (error) {
            toast.error('Failed to fetch annual goals')
        } finally {
            setLoading(false)
        }
    }

    const handleAddGoal = () => {
        setSelectedGoal(null)
        setEditIndex(null)
        setShowModal(true)
    }

    const handleEditGoal = (index) => {
        setSelectedGoal(annualGoals[index])
        setEditIndex(index)
        setShowModal(true)
    }

    const handleModalSubmit = async (goal) => {
        try {
            setLoading(true)
            if (editIndex !== null) {
                // Update logic (not implemented here)
                toast('Edit not implemented in this demo')
            } else {
                // Create new goal
                const payload = {
                    name: goal.name,
                    description: goal.description,
                    startDate: goal.startDate,
                    endDate: goal.endDate,
                    targetAmount: Number(goal.targetAmount),
                    monthlyContribution: Number(goal.monthlyContribution),
                }
                console.log('Sending payload to backend:', payload); // Debug log
                const result = await AnnualGoalService.createGoal(payload);
                console.log('Backend response:', result); // Debug log
                toast.success('Goal created successfully')
                fetchGoals()
            }
            setShowModal(false)
            setSelectedGoal(null)
            setEditIndex(null)
        } catch (error) {
            console.error('Error creating goal:', error); // Debug log
            toast.error('Failed to save goal')
        } finally {
            setLoading(false)
        }
    }

    // Delete logic omitted for brevity

    const calculateProgress = (current, target) => {
        return (current / target) * 100
    }

    const calculateMonthsRemaining = (current, target, monthlyTarget) => {
        const remaining = target - current
        return Math.ceil(remaining / monthlyTarget)
    }

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
                            <span className="font-semibold">${annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Saved</span>
                            <span className="font-semibold">${annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600 dark:text-gray-400">Total Goals</span>
                            <span className="font-semibold">{annualGoals.length}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: `${(
                                        annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                        (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)
                                    ) * 100}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {(
                                    annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                    (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)
                                ) * 100
                                    ? ((annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                        (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)) * 100).toFixed(1)
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
                            {annualGoals.length === 0 || annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) === 0 ? (
                                <div className="flex items-center justify-center h-24 text-gray-500 dark:text-gray-400 text-sm text-center">
                                    No goal data has been recorded yet.
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Target</span>
                                        <span className="font-semibold">
                                            ${annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Saved</span>
                                        <span className="font-semibold">
                                            ${annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-gray-600 dark:text-gray-400">Total Goals</span>
                                        <span className="font-semibold">{annualGoals.length}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{
                                                width: `${(
                                                    annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                    (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)
                                                ) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">0%</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {(
                                                annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)
                                            ) * 100
                                                ? (
                                                    (annualGoals.reduce((sum, g) => sum + Number(g.current || 0), 0) /
                                                        (annualGoals.reduce((sum, g) => sum + Number(g.target || 0), 0) || 1)) *
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
                {annualGoals.map((goal, index) => (
                    <div key={goal._id || index} className="bg-gray-50 p-5 rounded-lg dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">{iconMap[goal.category || goal.type] || <TargetIcon className="h-6 w-6 text-indigo-600" />}</div>
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
                                {/* Delete button here */}
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
                                    className="bg-indigo-600 h-2 rounded-full"
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

export default AnnualGoals