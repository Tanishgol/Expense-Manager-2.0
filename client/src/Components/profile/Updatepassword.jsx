import React, { useState } from 'react';
import { LockIcon } from 'lucide-react';

const UpdatePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle password update logic here
        console.log('Password update submitted');
    };

    // Simple password strength calculation
    const calculateStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const passwordStrength = calculateStrength(newPassword);

    const getStrengthLabel = () => {
        if (passwordStrength === 0) return 'None';
        if (passwordStrength <= 2) return 'Weak';
        if (passwordStrength <= 4) return 'Medium';
        return 'Strong';
    };

    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-200';
        if (passwordStrength <= 2) return 'bg-red-500';
        if (passwordStrength <= 4) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center dark:text-white">
                <LockIcon className="w-5 h-5 mr-2 text-green-600" />
                Update Password
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
                        >
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
                        >
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        />
                        {newPassword && (
                            <div className="mt-2">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs text-gray-500">Password Strength:</span>
                                    <span className="text-xs font-medium">{getStrengthLabel()}</span>
                                </div>
                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getStrengthColor()}`}
                                        style={{
                                            width: `${(passwordStrength / 5) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1 dark:text-white"
                        >
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                            required
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
                        )}
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors dark:bg-green-600 dark:text-white"
                            disabled={
                                !currentPassword ||
                                !newPassword ||
                                newPassword !== confirmPassword
                            }
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UpdatePassword;