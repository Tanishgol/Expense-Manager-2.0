import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start">
                        <span className="text-xl font-bold">ExpenseManager</span>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <p className="text-center md:text-right text-base text-gray-400">
                            &copy; {new Date().getFullYear()} ExpenseManager. All rights
                            reserved.
                        </p>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
                    <div className="flex justify-center space-x-6 md:justify-start">
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Privacy Policy
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Terms of Service
                        </Link>
                        <Link to="#" className="text-gray-400 hover:text-white">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
export default Footer