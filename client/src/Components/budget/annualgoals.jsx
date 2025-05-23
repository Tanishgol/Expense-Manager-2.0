import React from 'react'

const AnnualGoals = () => {
    const annualGoals = [
        {
            title: 'Emergency Fund',
            target: 10000,
            current: 7500,
            deadline: 'Dec 2024',
            category: 'Savings'
        },
        {
            title: 'Vacation Fund',
            target: 5000,
            current: 3000,
            deadline: 'Jun 2024',
            category: 'Travel'
        },
        {
            title: 'Home Renovation',
            target: 15000,
            current: 5000,
            deadline: 'Sep 2024',
            category: 'Housing'
        },
        {
            title: 'New Car Fund',
            target: 20000,
            current: 12000,
            deadline: 'Dec 2024',
            category: 'Transportation'
        }
    ]

    const calculateProgress = (current, target) => {
        return (current / target) * 100
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
                                <span className="text-sm text-gray-500">Due: {goal.deadline}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
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