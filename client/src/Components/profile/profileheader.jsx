import React, { useState, useRef } from 'react'
import { CameraIcon, UserIcon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ProfileHeader = () => {
    const { user, token } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('profilePhoto', file);

        setIsUploading(true);
        try {
            const response = await fetch('http://localhost:9000/api/users/profile-photo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload profile photo');
            }

            const data = await response.json();
            // Update the user context with new photo URL
            const updatedUser = { ...user, profilePhoto: data.profilePhoto };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.location.reload();
            toast.success('Profile photo updated successfully');
        } catch (error) {
            console.error('Error uploading photo:', error);
            toast.error('Failed to upload profile photo');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                        {user?.profilePhoto ? (
                            <img
                                src={user.profilePhoto}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon size={40} className="text-indigo-600" />
                        )}
                    </div>
                    <button
                        onClick={handleImageClick}
                        disabled={isUploading}
                        className="absolute bottom-0 right-0 p-2 bg-white rounded-full border border-gray-200 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CameraIcon size={16} className="text-gray-600" />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-800">{user?.fullName || 'User'}</h2>
                    <p className="text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileHeader;