import React from 'react';
import PropTypes from 'prop-types';

export function Checkbox({ label, className = '', ...props }) {
    return (
        <div className={`flex items-center ${className}`}>
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                {...props}
            />
            <label className="ml-2 block text-sm text-slate-700" htmlFor={props.id}>
                {label}
            </label>
        </div>
    );
}

export default Checkbox;
Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
};