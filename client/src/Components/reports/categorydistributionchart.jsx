import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CategoryDistributionChart = ({ transactions, dateRange }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current && transactions) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Set date range
                const now = new Date();
                let startDate, endDate;

                switch (dateRange) {
                    case 'month':
                        // Set to first day of current month at 00:00:00
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                        // Set to last day of current month at 23:59:59
                        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                        break;
                    case 'quarter':
                        const quarter = Math.floor(now.getMonth() / 3);
                        startDate = new Date(now.getFullYear(), quarter * 3, 1, 0, 0, 0);
                        endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0, 23, 59, 59);
                        break;
                    case 'year':
                        startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
                        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                        break;
                    default:
                        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);
                        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                }

                // Process transaction data
                const expensesByCategory = transactions
                    .filter(t => {
                        const transactionDate = new Date(t.date);
                        return transactionDate >= startDate && 
                               transactionDate <= endDate && 
                               t.amount < 0; // Only include negative amounts (expenses)
                    })
                    .reduce((acc, t) => {
                        acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
                        return acc;
                    }, {});

                const labels = Object.keys(expensesByCategory);
                const data = Object.values(expensesByCategory);

                // Generate colors for categories
                const colors = [
                    'rgba(59, 130, 246, 0.8)',   // Blue
                    'rgba(34, 197, 94, 0.8)',    // Green
                    'rgba(168, 85, 247, 0.8)',   // Purple
                    'rgba(245, 158, 11, 0.8)',   // Yellow
                    'rgba(239, 68, 68, 0.8)',    // Red
                    'rgba(236, 72, 153, 0.8)',   // Pink
                    'rgba(79, 70, 229, 0.8)',    // Indigo
                    'rgba(107, 114, 128, 0.8)',  // Gray
                ];

                // Ensure we have enough colors
                const backgroundColor = labels.map((_, index) => colors[index % colors.length]);

                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                data: data,
                                backgroundColor: backgroundColor,
                                borderColor: '#ffffff',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    boxWidth: 15,
                                    padding: 15,
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        const value = context.parsed;
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = Math.round((value / total) * 100);
                                        return `${context.label}: ${new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(value)} (${percentage}%)`;
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
    }, [transactions, dateRange]);

    return (
        <div className="h-80 w-full">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default CategoryDistributionChart;