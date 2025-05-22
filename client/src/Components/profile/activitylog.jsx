import React from 'react'
import {
    WalletIcon,
    BellIcon,
    KeyIcon,
    UserIcon,
    SettingsIcon,
} from 'lucide-react'

const ActivityLog = () => {
    const activities = [
        {
            id: 1,
            icon: <WalletIcon size={16} className="text-green-600" />,
            action: 'Updated budget limits',
            date: 'Today at 2:34 PM',
            category: 'Budget',
        },
        {
            id: 2,
            icon: <BellIcon size={16} className="text-blue-600" />,
            action: 'Changed notification settings',
            date: 'Yesterday at 11:15 AM',
            category: 'Settings',
        },
        {
            id: 3,
            icon: <KeyIcon size={16} className="text-indigo-600" />,
            action: 'Changed account password',
            date: 'Jul 12, 2023',
            category: 'Security',
        },
        {
            id: 4,
            icon: <UserIcon size={16} className="text-purple-600" />,
            action: 'Updated profile information',
            date: 'Jul 10, 2023',
            category: 'Profile',
        },
        {
            id: 5,
            icon: <SettingsIcon size={16} className="text-gray-600" />,
            action: 'Modified account settings',
            date: 'Jul 8, 2023',
            category: 'Settings',
        },
    ]
    return (
        <div className="space-y-4">
            {activities.map((activity) => (
                <div
                    key={activity.id}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-50 rounded-lg">{activity.icon}</div>
                        <div>
                            <p className="font-medium text-gray-800">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                    </div>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {activity.category}
                    </span>
                </div>
            ))}
        </div>
    )
}

export default ActivityLog;