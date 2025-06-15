import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const FloatingThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 p-3 rounded-full bg-white dark:bg-dark-card shadow-lg hover:shadow-xl transition-all duration-200 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            ) : (
                <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
            )}
        </button>
    );
};

export default FloatingThemeToggle;