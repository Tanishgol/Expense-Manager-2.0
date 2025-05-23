import React from 'react'
import ProfileHeader from './profileheader'
import ActivityLog from './activitylog'
import {
    UserIcon,
    KeyIcon,
    ShieldIcon,
    BellIcon,
    GlobeIcon,
} from 'lucide-react'
const Profile = () => {
    return (
        <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <ProfileHeader />

                    <div className="bg-white rounded-lg shadow p-6 space-y-8">
                        {/* Personal Info */}
                        <section className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Personal Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { label: "Full Name", type: "text", value: "Alex Johnson" },
                                    { label: "Email Address", type: "email", value: "alex@example.com" },
                                    { label: "Phone Number", type: "tel", value: "+1 (555) 123-4567" },
                                    { label: "Location", type: "text", value: "San Francisco, CA" }
                                ].map((field, i) => (
                                    <div key={i}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {field.label}
                                        </label>
                                        <input
                                            type={field.type}
                                            value={field.value}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Preferences */}
                        <section className="border-b pb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Account Preferences
                            </h2>
                            <div className="space-y-6">
                                {/* Language */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <GlobeIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Language</p>
                                            <p className="text-sm text-gray-500">Choose your preferred language</p>
                                        </div>
                                    </div>
                                    <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                    </select>
                                </div>

                                {/* Notifications */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg">
                                            <BellIcon className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">Notifications</p>
                                            <p className="text-sm text-gray-500">Manage your notification preferences</p>
                                        </div>
                                    </div>
                                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                                        Configure
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* Activity Log */}
                        <section>
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">
                                Recent Activity
                            </h2>
                            <ActivityLog />
                        </section>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-4">
                            {[
                                { label: "Edit Profile", desc: "Update your personal information", icon: UserIcon },
                                { label: "Change Password", desc: "Update your security credentials", icon: KeyIcon },
                                { label: "Privacy Settings", desc: "Control your data and privacy", icon: ShieldIcon }
                            ].map((action, i) => (
                                <button
                                    key={i}
                                    className="flex items-center space-x-3 w-full p-3 text-left rounded-lg hover:bg-gray-50"
                                >
                                    <div className="p-2 bg-indigo-50 rounded-lg">
                                        <action.icon className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{action.label}</p>
                                        <p className="text-sm text-gray-500">{action.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h2>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div>
                                <p className="text-xs uppercase text-gray-500">Member Since</p>
                                <p className="font-medium text-gray-800">January 15, 2023</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500">Last Login</p>
                                <p className="font-medium text-gray-800">Today at 2:34 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;