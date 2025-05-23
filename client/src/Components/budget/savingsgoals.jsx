import React from 'react'
import { PiggyBankIcon, TrendingUpIcon, TargetIcon } from 'lucide-react'

const SavingsGoals = () => {
    const savingsGoals = [
        {
            title: 'Emergency Fund',
            target: 15000,
            current: 10000,
            monthlyTarget: 500,
            icon: <PiggyBankIcon className="h-6 w-6 text-indigo-600" />,
            category: 'Safety Net'
        },
        {
            title: 'Retirement Savings',
            target: 50000,
            current: 25000,
            monthlyTarget: 1000,
            icon: <TrendingUpIcon className="h-6 w-6 text-green-600" />,
            category: 'Long-term'
        },
        {
            title: 'Down Payment',
            target: 40000,
            current: 15000,
            monthlyTarget: 800,
            icon: <TargetIcon className="h-6 w-6 text-blue-600" />,
            category: 'Housing'
        }
    ]

    const calculateProgress = (current, target) => {
        return (current / target) * 100
    }

    const calculateMonthsRemaining = (current, target, monthlyTarget) => {
        const remaining = target - current
        return Math.ceil(remaining / monthlyTarget)
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Savings Overview
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Total Target</span>
                            <span className="font-semibold">$105,000.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Total Saved</span>
                            <span className="font-semibold">$50,000.00</span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-600">Monthly Target</span>
                            <span className="font-semibold">$2,300.00</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                            <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{
                                    width: '47.6%',
                                }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs text-gray-500">47.6% saved</span>
                            <span className="text-xs text-gray-500">100%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Savings Insights
                    </h2>
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-5">
                        <h3 className="font-medium text-blue-800 mb-3">
                            Progress Highlights
                        </h3>
                        <ul className="text-sm text-blue-700 space-y-2">
                            <li>• Emergency Fund is 66.7% complete</li>
                            <li>• Retirement Savings is halfway to target</li>
                            <li>• Down Payment needs 31 months at current rate</li>
                            <li>• Total monthly savings target: $2,300</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Savings Goals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savingsGoals.map((goal, index) => (
                        <div key={index} className="bg-gray-50 p-5 rounded-lg">
                            <div className="flex items-start mb-4">
                                <div className="flex-shrink-0">{goal.icon}</div>
                                <div className="ml-4">
                                    <h3 className="font-medium text-gray-800">{goal.title}</h3>
                                    <p className="text-sm text-gray-500">{goal.category}</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Progress</span>
                                    <span className="text-sm font-medium">
                                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
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
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>0%</span>
                                    <span>{calculateProgress(goal.current, goal.target).toFixed(1)}% complete</span>
                                    <span>100%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Monthly Target</span>
                                    <span className="font-medium">${goal.monthlyTarget.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Months Remaining</span>
                                    <span className="font-medium">
                                        {calculateMonthsRemaining(goal.current, goal.target, goal.monthlyTarget)} months
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SavingsGoals