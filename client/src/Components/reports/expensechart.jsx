import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ExpenseChart = ({ dateRange }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                // Destroy existing chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                let labels, data;

                // Set data based on selected date range
                switch (dateRange) {
                    case 'month':
                        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                        data = [520, 680, 540, 400];
                        break;
                    case 'quarter':
                        labels = ['Month 1', 'Month 2', 'Month 3'];
                        data = [1700, 2140, 1980];
                        break;
                    case 'year':
                        labels = [
                            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                        ];
                        data = [1900, 2100, 1950, 2140, 2000, 2300, 2200, 2100, 2400, 2200, 2350, 2500];
                        break;
                    default:
                        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                        data = [520, 680, 540, 400];
                }

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
    }, [dateRange]);

    return <canvas ref={chartRef}></canvas>;
};

export default ExpenseChart;