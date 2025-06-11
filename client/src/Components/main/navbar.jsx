import React, { useState, useEffect } from 'react';
import {
    LayoutDashboardIcon,
    ArrowLeftRightIcon,
    PieChartIcon,
    WalletIcon,
    SettingsIcon,
    LogOutIcon,
    MenuIcon,
    XIcon,
    UserIcon,
    ChevronDownIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../elements/ThemeToggle';

export const Navbar = ({ activeTab, setActiveTab }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { isDarkMode } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: <LayoutDashboardIcon size={20} />,
            route: '/dashboard',
        },
        {
            id: 'transactions',
            label: 'Transactions',
            icon: <ArrowLeftRightIcon size={20} />,
            route: '/transactions',
        },
        {
            id: 'budgets',
            label: 'Budgets',
            icon: <WalletIcon size={20} />,
            route: '/budgets',
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: <PieChartIcon size={20} />,
            route: '/reports',
        },
    ];

    const handleNavigation = (item) => {
        setActiveTab(item.id);
        navigate(item.route);
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
    };

    const handleProfileNavigation = (route) => {
        navigate(route);
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white dark:bg-dark-card shadow-md' 
                    : 'bg-white dark:bg-dark-card'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="font-bold text-indigo-600 dark:text-indigo-400 text-xl md:text-lg">
                        ExpenseTracker
                    </div>
                    <div className="hidden md:flex space-x-4 items-center">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    activeTab === item.id
                                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-dark-border'
                                }`}
                            >
                                <span className="mr-2">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                aria-haspopup="true"
                                aria-expanded={isProfileOpen}
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                                    <UserIcon size={20} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="hidden lg:block ml-2 text-left">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user?.email || 'user@example.com'}
                                    </p>
                                </div>
                                <ChevronDownIcon
                                    size={16}
                                    className={`hidden md:block ml-1 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                                        isProfileOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-md shadow-lg py-1 z-50">
                                    <button
                                        onClick={() => handleProfileNavigation('/profile')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border"
                                    >
                                        <UserIcon size={16} className="mr-3" />
                                        Your Profile
                                    </button>
                                    <button
                                        onClick={() => handleProfileNavigation('/settings')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-border"
                                    >
                                        <SettingsIcon size={16} className="mr-3" />
                                        Settings
                                    </button>
                                    <div className="border-t border-gray-100 dark:border-dark-border my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-dark-border"
                                    >
                                        <LogOutIcon size={16} className="mr-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-dark-border focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden mobile-menu transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border`}
            >
                <div className="px-4 pt-2 pb-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                                activeTab === item.id
                                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                    : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-dark-border'
                            }`}
                        >
                            <span className="mr-3">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;