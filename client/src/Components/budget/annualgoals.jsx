import React, { useState, useEffect } from 'react'
import AnnualGoalService from '../../services/annualGoalService'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AnnualGoals = () => {
    const [annualGoals, setAnnualGoals] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchAnnualGoals()
    }, [])

    const fetchAnnualGoals = async () => {
        try {
            setIsLoading(true)
            const goals = await AnnualGoalService.getAllGoals()
            setAnnualGoals(goals || [])
        } catch (error) {
            console.error('Error fetching annual goals:', error)
            if (error.message === 'Please authenticate' || error.response?.status === 401) {
                toast.error('Session expired. Please login again')
                navigate('/login')
            } else {
                toast.error(error.message || 'Failed to fetch annual goals')
            }
            setAnnualGoals([])
        } finally {
            setIsLoading(false)
        }
    }

    const calculateProgress = (current, target) => {
        if (!current || !target || target === 0) return 0
        return (current / target) * 100
    }

    const calculateTotalTarget = () => {
        if (!annualGoals.length) return 0
        return annualGoals.reduce((total, goal) => total + (goal.target || 0), 0)
    }

    const calculateTotalSaved = () => {
        if (!annualGoals.length) return 0
        return annualGoals.reduce((total, goal) => total + (goal.current || 0), 0)
    }

    const calculateTotalRemaining = () => {
        return calculateTotalTarget() - calculateTotalSaved()
    }

    const calculateTotalProgress = () => {
        const totalTarget = calculateTotalTarget()
        if (!totalTarget) return 0
        return (calculateTotalSaved() / totalTarget) * 100
    }

    const getProgressHighlights = () => {
        if (!annualGoals.length) return []

        return annualGoals.map(goal => {
            const progress = calculateProgress(goal.current, goal.target)
            const deadline = new Date(goal.deadline)
            const today = new Date()
            const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 +
                (deadline.getMonth() - today.getMonth())

            let status = ''
            if (progress >= 100) {
                status = 'completed'
            } else if (progress >= 75) {
                status = 'almost complete'
            } else if (monthsRemaining <= 3 && progress < 75) {
                status = 'needs increased savings'
            } else if (progress >= 50) {
                status = 'on track'
            } else {
                status = 'needs attention'
            }

            return {
                title: goal.title,
                progress,
                status,
                deadline: goal.deadline
            }
        })
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    const progressHighlights = getProgressHighlights()
    const totalTarget = calculateTotalTarget()
    const totalSaved = calculateTotalSaved()
    const totalRemaining = calculateTotalRemaining()
    const totalProgress = calculateTotalProgress()

    if (!annualGoals.length) {
        return (
            <div className="text-center py-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Annual Goals</h2>
                <p className="text-gray-600">No annual goals set yet. Start by creating your first goal!</p>
            </div>
        )
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
                            <span className="font-semibold">${totalTarget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Total Saved</span>
                            <span className="font-semibold">${totalSaved.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Remaining</span>
                            <span className="font-semibold text-green-600">${totalRemaining.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: `${totalProgress}%`,
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs text-gray-500">{totalProgress.toFixed(1)}% saved</span>
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
                            {progressHighlights.map((highlight, index) => (
                                <li key={index}>
                                    • {highlight.title} is {highlight.status}
                                    {highlight.status === 'on track' && ` for ${new Date(highlight.deadline).toLocaleDateString('en-US', { month: 'long' })} deadline`}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Goal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {annualGoals.map((goal, index) => (
                        <div key={index} className="bg-gray-50 p-5 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                                    <p className="text-sm text-gray-500">{goal.category}</p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Due: {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">Progress</span>
                                <span className="text-sm font-medium">
                                    ${(goal.current || 0).toLocaleString()} / ${(goal.target || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-indigo-600 h-2 rounded-full"
                                    style={{
                                        width: `${calculateProgress(goal.current, goal.target)}%`,
                                    }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">0%</span>
                                <span className="text-xs text-gray-500">
                                    {calculateProgress(goal.current, goal.target).toFixed(1)}% complete
                                </span>
                                <span className="text-xs text-gray-500">100%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AnnualGoals