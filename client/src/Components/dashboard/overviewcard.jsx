import React from 'react';

const OverviewCard = ({ title, value, change, positive, icon, color }) => {
    return (
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 relative">
            <div className="flex justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-300">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-300 mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                    {icon}
                </div>
            </div>
            <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${positive ? 'text-green-600 dark:text-lime-500' : 'text-red-600 dark:text-red-500'}`}>
                    {change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-300 ml-1">from last month</span>
            </div>
        </div>
    );
};

export default OverviewCard;