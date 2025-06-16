import React from 'react';
import { UserIcon } from 'lucide-react';

const ProfileHeader = ({ name, email, avatarUrl }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center dark:bg-gray-800">
            <div className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden mb-4 border-4 border-green-100">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={`${name}'s profile`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                    </div>
                )}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{name}</h2>
            <p className="text-gray-500 dark:text-white">{email}</p>
        </div>
    );
};

export default ProfileHeader;