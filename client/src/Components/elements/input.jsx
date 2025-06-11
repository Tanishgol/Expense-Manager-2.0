import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    className = '',
    icon,
    success,
    ...props
}, ref) => {
    return (
        <div className="mb-4">
            {label && <label className="mb-2 block text-sm font-medium text-navy-900 dark:text-gray-300">{label}</label>}

            <div className="relative">
                {icon && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 dark:text-gray-400">
                        {icon}
                    </div>
                )}

                <input
                    ref={ref}
                    className={`w-full rounded-lg border px-4 py-2.5 transition-all focus:outline-none focus:ring-1 bg-white dark:bg-dark-card text-gray-900 dark:text-gray-100
                    ${icon ? 'pl-10' : ''}
                    ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:focus:border-red-500 dark:focus:ring-red-500' : ''}
                    ${success ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500 dark:border-emerald-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-500' : ''}
                    ${!error && !success ? 'border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 dark:border-dark-border dark:focus:border-emerald-400 dark:focus:ring-emerald-400' : ''}
                    ${className || ''}`}
                    autoComplete="off"
                    {...props}
                />

                {success && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-emerald-600 dark:text-lime-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;