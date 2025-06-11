import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';

const AppLayout = ({ children, activeTab, setActiveTab }) => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const tabFromPath = path.split('/')[1];
        const validTabs = ['dashboard', 'transactions', 'budgets', 'reports', 'settings', 'profile'];

        if (validTabs.includes(tabFromPath)) {
            setActiveTab(tabFromPath);
        }
    }, [location.pathname, setActiveTab]);

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-dark-bg text-white">
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
                {children}
            </main>
        </div>
    );
};

export default AppLayout;