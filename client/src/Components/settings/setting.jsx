import React from 'react'
export const Settings = () => {
    return (
        <div className="bg-gray-50 dark:bg-dark-card min-h-screen rounded-lg">
            <div className="mx-auto space-y-8 mt-14 p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Settings
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Account Settings */}
                    <div className="col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Account Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value="Alex Johnson"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value="alex@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Currency
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
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

                    {/* Notification Preferences */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Notification Preferences
                        </h2>
                        <div className="space-y-4">
                            {[
                                {
                                    title: "Budget Alerts",
                                    desc: "Get notified when you're approaching budget limits",
                                    checked: true,
                                },
                                {
                                    title: "Unusual Activity",
                                    desc: "Get notified about large or unusual transactions",
                                    checked: true,
                                },
                                {
                                    title: "Weekly Reports",
                                    desc: "Receive weekly spending and saving reports",
                                    checked: false,
                                },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            defaultChecked={item.checked}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 dark:bg-gray-700 dark:border-gray-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Manage your transaction categories
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "Housing",
                            "Food",
                            "Transportation",
                            "Entertainment",
                            "Utilities",
                            "Healthcare",
                            "Shopping",
                        ].map((cat, i) => (
                            <div
                                key={i}
                                className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                            >
                                {cat} <span className="ml-2 cursor-pointer">×</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Add new category"
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                        />
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md">
                            Add
                        </button>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Data Management
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <button className="bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-md">
                                Export All Data
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Download all your financial data in CSV format
                            </p>
                        </div>
                        <div>
                            <button className="bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-600 px-4 py-2 rounded-md">
                                Delete Account
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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