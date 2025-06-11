import React from 'react';
import { Modal } from '../modals/Modal';

const ViewMessageModal = ({ isOpen, onClose, messages }) => {
    // Group messages by type
    const groupedMessages = messages.reduce((acc, message) => {
        if (!acc[message.type]) {
            acc[message.type] = [];
        }
        acc[message.type].push(message);
        return acc;
    }, {});

    const getTypeTitle = (type) => {
        switch (type) {
            case 'budget':
                return 'Budget Alerts';
            case 'goal':
                return 'Goal Progress';
            case 'trend':
                return 'Spending Trends';
            default:
                return 'Other Insights';
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="All Insights & Messages"
        >
            <div className="space-y-6">
                {Object.entries(groupedMessages).map(([type, typeMessages]) => (
                    <div key={type} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                            {getTypeTitle(type)}
                        </h3>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                            <ul className="space-y-2">
                                {typeMessages.map((message, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="mr-2 text-gray-600 dark:text-gray-400">•</span>
                                        <span
                                            className={`font-semibold ${message.status === 'critical'
                                                    ? 'text-red-700 dark:text-red-400'
                                                    : message.status === 'warning'
                                                        ? 'text-yellow-700 dark:text-yellow-400'
                                                        : 'text-blue-700 dark:text-cyan-300'
                                                }`}
                                        >
                                            {message.message}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default ViewMessageModal;