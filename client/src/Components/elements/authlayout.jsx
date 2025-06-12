import React from 'react';
import { Link } from 'react-router-dom';
import FloatingThemeToggle from './FloatingThemeToggle'; // Assuming you have this component

const AuthLayout = ({ title, subtitle, children, illustration }) => {
    const currency = '₹'; // No need to use useState for static values

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-dark-bg dark:to-dark-card flex">
            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Side (Form Area) */}
                <div className="w-full md:w-1/2 flex items-center justify-center px-4 py-5 sm:px-6 lg:px-12">
                    <div className="w-full max-w-md mx-auto">
                        {/* Branding with Currency Symbol */}
                        <div className="mb-8 flex items-center justify-center sm:justify-start space-x-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                                <span className="text-xl font-bold">{currency}</span>
                            </div>
                            <Link to="/" className="text-xl font-bold text-navy-900 dark:text-white">
                                ExpenseManager
                            </Link>
                        </div>

                        <div className="mb-6">
                            <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 dark:text-white text-center sm:text-left">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="mt-2 text-slate-600 dark:text-slate-400 text-center sm:text-left">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        <div>{children}</div>
                    </div>
                </div>

                <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 dark:from-emerald-600 dark:to-emerald-800 p-8">
                    <div className="max-w-md text-white">{illustration}</div>
                </div>
            </div>

            <FloatingThemeToggle />
        </div>
    );
};

export default AuthLayout;