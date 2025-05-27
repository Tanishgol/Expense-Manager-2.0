import React from 'react'

const Monthlygoals = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Monthly Goals</h2>
                    <p className="text-gray-600 mb-4">Set your monthly financial goals to stay on track.</p>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Goal Name</label>
                            <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Save for vacation" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                            <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 1000" />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200">Set Goal</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Monthlygoals;