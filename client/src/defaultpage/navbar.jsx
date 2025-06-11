import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MenuIcon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../Components/elements/ThemeToggle'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isDarkMode } = useTheme()

    return (
        <nav className="bg-white dark:bg-dark-card shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                                ExpenseManager
                            </span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        <Link 
                            to="/login" 
                            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link 
                            to="/login" 
                            className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-base font-medium"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            className="block bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar