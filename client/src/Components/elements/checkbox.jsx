import React from 'react';
import PropTypes from 'prop-types';

export function Checkbox({ label, className = '', ...props }) {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:text-emerald-400 dark:focus:ring-emerald-300"
                {...props}
            />
            <label className="ml-2 block text-sm text-slate-700 dark:text-white" htmlFor={props.id}>
                {label}
            </label>
        </div>
    );
}

export default Checkbox;

Checkbox.propTypes = {
    label: PropTypes.node.isRequired,
    className: PropTypes.string,
};