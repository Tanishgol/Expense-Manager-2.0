import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ExpenseChart = ({ dateRange, transactions }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && transactions) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                // Destroy existing chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const processData = () => {
                    const now = new Date();
                    let startDate, endDate, labels;

                    // Set date range and labels based on selection
                    switch (dateRange) {
                        case 'month':
                            // Set to first day of current month at 00:00:00
                            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                            // Set to last day of current month at 23:59:59
                            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                            break;
                        case 'quarter':
                            const quarter = Math.floor(now.getMonth() / 3);
                            startDate = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0);
                            endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59);
                            // Get month names for the quarter
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            labels = [
                                monthNames[quarter * 3],
                                monthNames[quarter * 3 + 1],
                                monthNames[quarter * 3 + 2]
                            ];
                            break;
                        case 'year':
                            startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
                            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                            labels = [
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                            ];
                            break;
                        default:
                            startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                    }

                    // Filter transactions within the date range
                    const filteredTransactions = transactions.filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate >= startDate && 
                               transactionDate <= endDate && 
                               t.amount < 0; // Only include negative amounts (expenses)
                    });

                    const data = new Array(labels.length).fill(0);

                    filteredTransactions.forEach(transaction => {
                        const date = new Date(transaction.date);
                        let index;

                        if (dateRange === 'month') {
                            // Calculate week number (0-3)
                            const weekNumber = Math.floor((date.getDate() - 1) / 7);
                            index = Math.min(weekNumber, 3); // Ensure index is within bounds
                        } else if (dateRange === 'quarter') {
                            // Calculate month within quarter (0-2)
                            index = date.getMonth() % 3;
                        } else {
                            // Use month number (0-11)
                            index = date.getMonth();
                        }

                        data[index] += Math.abs(transaction.amount);
                    });

                    return { labels, data };
                };

                const { labels, data } = processData();

                // Create new chart
                chartInstance.current = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Expenses',
                                data: data,
                                borderColor: 'rgb(239, 68, 68)',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                tension: 0.3,
                                fill: true,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                callbacks: {
                                    label: function (context) {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(context.parsed.y);
                                        }
                                        return label;
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function (value) {
                                        return '$' + value;
                                    },
                                },
                            },
                        },
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [dateRange, transactions]);

    return <canvas ref={chartRef}></canvas>;
};

export default ExpenseChart;