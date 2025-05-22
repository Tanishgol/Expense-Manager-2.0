import React from 'react'
import { CameraIcon, UserIcon } from 'lucide-react'
const ProfileHeader = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <UserIcon size={40} className="text-indigo-600" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50">
                        <CameraIcon size={16} className="text-gray-600" />
                    </button>
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">Alex Johnson</h2>
                    <p className="text-gray-500">Premium Member</p>
                    <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                            Active
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                            Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;