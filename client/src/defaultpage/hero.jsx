import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/login');
    };

    return (
        <div className="bg-gradient-to-b from-white to-blue-50 dark:from-dark-bg dark:to-dark-card w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="lg:flex lg:items-center lg:justify-between">
                    <div className="lg:w-1/2 mb-10 lg:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Take Control of Your{' '}
                            <span className="text-blue-600 dark:text-blue-400">Finances</span>
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            Track, manage, and understand your expenses with our intuitive
                            expense management solution.
                        </p>
                        <button
                            type="button"
                            onClick={handleGetStarted}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-150 ease-in-out"
                        >
                            Login to Get Started
                            <ArrowRightIcon className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                    <div className="lg:w-1/2 flex justify-center">
                        <img
                            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                            alt="Financial management illustration"
                            className="w-full max-w-md rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;