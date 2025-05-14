import PropTypes from 'prop-types';
import React from 'react';

function Button({
    children, variant = "primary", fullWidth = false, className = "", ...props
}) {
    const baseClasses = "font-medium rounded-lg px-4 py-2.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variantClasses = {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg focus:ring-emerald-500",
        secondary: "bg-navy-800 text-white hover:bg-navy-900 shadow-md hover:shadow-lg focus:ring-navy-500",
        outline: "border border-slate-300 text-navy-900 hover:bg-slate-100 focus:ring-slate-500",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(["primary", "secondary", "outline"]),
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};

export default Button;