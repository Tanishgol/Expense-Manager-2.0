import React from 'react'
import ProfileHeader from './Profileheader'
import AccountInfo from './Accountinfo'
import UpdatePassword from './Updatepassword'
import PersonalInfo from './Personalinfo'
import ActivityLog from './Activitylog'

const Profile = () => {
    return (
            <div className="w-full mx-auto p-6 space-y-8 bg-gray-50 text-gray-900 mt-14 dark:bg-dark-card rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 dark:text-white">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <ProfileHeader
                        name="Alex Johnson"
                        email="alex@example.com"
                        avatarUrl="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
                    />
                    <AccountInfo
                        status="Active"
                        memberSince="January 15, 2023"
                        lastLogin="Today at 2:34 PM"
                    />
                    <PersonalInfo
                        fullName="Alex Johnson"
                        email="alex@example.com"
                        location="San Francisco, CA"
                    />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <UpdatePassword />
                    <ActivityLog />
                </div>
            </div>
        </div>
    )
}

export default Profile