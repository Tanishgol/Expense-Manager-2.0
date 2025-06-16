import React from 'react';
import { UserIcon, MailIcon, MapPinIcon } from 'lucide-react';

const PersonalInfo = ({ fullName, email, location }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
                <UserIcon className="w-5 h-5 mr-2 text-green-600" />
                Personal Information
            </h2>
            <div className="space-y-4">
                <div className="flex items-start">
                    <UserIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-white">Full Name</p>
                        <p className="font-medium dark:text-white">{fullName}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <MailIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-white">Email Address</p>
                        <p className="font-medium dark:text-white">{email}</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-500 dark:text-white">Location</p>
                        <p className="font-medium dark:text-white">{location}</p>
                    </div>
                </div>
                <button className="mt-2 text-sm text-green-600 hover:text-green-800 font-medium flex items-center dark:text-green-600">
                    Edit Information
                </button>
            </div>
        </div>
    );
};

export default PersonalInfo;