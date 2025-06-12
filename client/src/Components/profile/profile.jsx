import React from 'react'
import ProfileHeader from './profileheader'
import ActivityLog from './activitylog'
import { GlobeIcon } from 'lucide-react'

const Profile = () => {
    return (
        <div className="space-y-8 px-4 py-6 sm:px-6 lg:px-8 mt-10">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ProfileHeader />

                    <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6 space-y-8">
                        <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                Account Preferences
                            </h2>

                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                        <GlobeIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">Language</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred language</p>
                                    </div>
                                </div>
                                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                                    <option>English (US)</option>
                                    <option>Spanish</option>
                                    <option>French</option>
                                </select>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Account Status
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-between gap-6 text-sm text-gray-600 dark:text-gray-300">
                            <div>
                                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Member Since</p>
                                <p className="font-medium text-gray-800 dark:text-white">January 15, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
                                <p className="font-medium text-gray-800 dark:text-white">Today at 2:34 PM</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Update Password
                        </h2>

                        <div className="space-y-4">
                            {[
                                { label: "Current Password", name: "currentPassword" },
                                { label: "New Password", name: "newPassword" },
                                { label: "Confirm New Password", name: "confirmPassword" }
                            ].map((field, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {field.label}
                                    </label>
                                    <input
                                        type="password"
                                        name={field.name}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-dark-card dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
                <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "Full Name", type: "text", value: "Alex Johnson" },
                            { label: "Email Address", type: "email", value: "alex@example.com" },
                            { label: "Location", type: "text", value: "San Francisco, CA", fullWidth: true }
                        ].map((field, i) => (
                            <div key={i} className={field.fullWidth ? "md:col-span-2" : ""}>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
                                <input
                                    type={field.type}
                                    defaultValue={field.value}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-dark-card dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow p-6">
                    <ActivityLog />
                </div>
            </div>
        </div>
    )
}

export default Profile
