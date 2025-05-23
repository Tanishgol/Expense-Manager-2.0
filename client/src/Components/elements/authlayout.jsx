import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, illustration }) => {
    const [currency] = useState('₹');

    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <div className="flex w-full flex-col justify-center px-4 py-5 md:w-1/2 md:px-8 lg:px-12">
                <div className="mx-auto w-full max-w-md">
                    <div className="mb-8">
                        <Link to="/" className="flex items-center justify-center space-x-2 sm:justify-start">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                                <span className="text-xl font-bold">{currency}</span>
                            </div>
                            <span className="text-xl font-bold text-navy-900">ExpenseManager</span>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <h1 className="text-3xl sm:text-4xl font-bold text-navy-900 text-center sm:text-left">{title}</h1>
                        {subtitle && <p className="mt-2 text-slate-600 text-center sm:text-left">{subtitle}</p>}

                    </div>

                    {children}
                </div>
            </div>

            <div className="hidden bg-gradient-to-br from-emerald-500 to-emerald-700 md:flex md:w-1/2 md:items-center md:justify-center md:p-8">
                <div className="max-w-md text-white">{illustration}</div>
            </div>
        </div>
    );
};

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    illustration: PropTypes.node
};

export default AuthLayout;