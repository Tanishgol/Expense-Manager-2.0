import React, { useState, useEffect } from 'react';
import { LayoutDashboardIcon, ArrowLeftRightIcon, PieChartIcon, WalletIcon, SettingsIcon, LogOutIcon, MenuIcon, XIcon, SearchIcon, BellIcon, UserIcon, ChevronDownIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && !event.target.closest('.mobile-menu')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

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
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-indigo-600">
                            ExpenseTracker
                        </h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center flex-1">
                        <div className="flex items-center space-x-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item)}
                                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${activeTab === item.id
                                            ? 'text-indigo-600 bg-indigo-50'
                                            : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                        }`}
                                    aria-current={activeTab === item.id ? 'page' : undefined}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side items */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="p-2 text-gray-500 hover:text-gray-700 relative focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
                            aria-label="Notifications"
                        >
                            <BellIcon size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-expanded={isProfileOpen}
                                aria-haspopup="true"
                            >
                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <UserIcon size={20} className="text-indigo-600" />
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-medium text-gray-700">
                                        {user?.fullName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                                </div>
                                <ChevronDownIcon
                                    size={16}
                                    className={`hidden md:block text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'transform rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Profile Dropdown Menu */}
                            {isProfileOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-10"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="user-menu"
                                >
                                    <button
                                        onClick={() => handleProfileNavigation('/profile')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        <UserIcon size={16} className="mr-3" />
                                        <span>Your Profile</span>
                                    </button>
                                    <button
                                        onClick={() => handleProfileNavigation('/settings')}
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        <SettingsIcon size={16} className="mr-3" />
                                        <span>Settings</span>
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        <LogOutIcon size={16} className="mr-3" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <XIcon size={24} />
                            ) : (
                                <MenuIcon size={24} />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden mobile-menu transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item)}
                            className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${activeTab === item.id
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                }`}
                            aria-current={activeTab === item.id ? 'page' : undefined}
                        >
                            <span className="mr-3">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;