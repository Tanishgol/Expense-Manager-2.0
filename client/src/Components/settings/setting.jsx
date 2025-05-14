import React from 'react'
export const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Account Settings
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value="Alex Johnson"
                                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value="alex@example.com"
                                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Currency
                            </label>
                            <select className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>JPY (¥)</option>
                            </select>
                        </div>
                        <div className="pt-4">
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Notification Preferences
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Budget Alerts</p>
                                <p className="text-sm text-gray-500">
                                    Get notified when you're approaching budget limits
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Unusual Activity</p>
                                <p className="text-sm text-gray-500">
                                    Get notified about large or unusual transactions
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-800">Weekly Reports</p>
                                <p className="text-sm text-gray-500">
                                    Receive weekly spending and saving reports
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Manage your transaction categories
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Housing <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Food <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Transportation <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Entertainment <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Utilities <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Healthcare <span className="ml-2 cursor-pointer">×</span>
                        </div>
                        <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                            Shopping <span className="ml-2 cursor-pointer">×</span>
                        </div>
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Add new category"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md">
                            Add
                        </button>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Data Management
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2 rounded-md">
                                Export All Data
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                Download all your financial data in CSV format
                            </p>
                        </div>
                        <div>
                            <button className="bg-white hover:bg-gray-50 text-red-600 border border-red-300 px-4 py-2 rounded-md">
                                Delete Account
                            </button>
                            <p className="text-xs text-gray-500 mt-1">
                                Permanently delete your account and all your data
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings