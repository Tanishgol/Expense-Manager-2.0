import React from 'react';
import { ClockIcon, AlertCircleIcon } from 'lucide-react';

const ActivityLog = () => {
    const activities = [
        {
            id: '1',
            date: 'Today at 2:34 PM',
            activity: 'Updated budget limits',
            section: 'Budget',
        },
        {
            id: '2',
            date: 'Yesterday at 11:15 AM',
            activity: 'Changed notification settings',
            section: 'Settings',
        },
        {
            id: '3',
            date: 'Jul 12, 2023',
            activity: 'Changed account password',
            section: 'Security',
        },
    ];

    const getSectionColor = (section) => {
        switch (section.toLowerCase()) {
            case 'budget':
                return 'bg-blue-100 text-blue-800';
            case 'settings':
                return 'bg-purple-100 text-purple-800';
            case 'security':
                return 'bg-red-100 text-red-800';
            case 'profile':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
                <ClockIcon className="w-5 h-5 mr-2 text-green-600" />
                Recent Activity Log
            </h2>
            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-6">
                        <AlertCircleIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No recent activity found</p>
                    </div>
                ) : (
                    activities.map((item) => (
                        <div key={item.id} className="border-l-2 border-gray-200 pl-4 py-1">
                            <p className="text-sm text-gray-500 dark:text-white">{item.date}</p>
                            <p className="font-medium dark:text-white">{item.activity}</p>
                            <span
                                className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getSectionColor(item.section)}`}
                            >
                                {item.section}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLog;