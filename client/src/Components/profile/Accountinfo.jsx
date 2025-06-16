import React from 'react';
import { CalendarIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';

const AccountInfo = ({ status, memberSince, lastLogin }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
                <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
                Account Info
            </h2>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-white">Account Status:</span>
                    <span className="font-medium dark:text-white">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        {status}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center dark:text-white">
                        <CalendarIcon className="w-4 h-4 mr-1 text-gray-400" />
                        Member Since:
                    </span>
                    <span className="font-medium dark:text-white">{memberSince}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center dark:text-white">
                        <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                        Last Login:
                    </span>
                    <span className="font-medium dark:text-white">{lastLogin}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;