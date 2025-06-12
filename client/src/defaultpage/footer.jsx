import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-dark-card text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start">
                        <span className="text-xl font-bold text-white dark:text-gray-100">ExpenseManager</span>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <p className="text-center md:text-right text-base text-gray-400 dark:text-gray-500">
                            &copy; {new Date().getFullYear()} ExpenseManager. All rights
                            reserved.
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 dark:border-dark-border pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:justify-start">
                        <Link to="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer