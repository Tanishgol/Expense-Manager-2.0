import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const IncomeExpenseChart = ({ dateRange }) => {
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

                let labels, incomeData, expenseData;

                // Set data based on selected date range
                switch (dateRange) {
                    case 'month':
                        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                        incomeData = [3200, 350, 0, 0];
                        expenseData = [520, 680, 540, 400];
                        break;
                    case 'quarter':
                        labels = ['Month 1', 'Month 2', 'Month 3'];
                        incomeData = [3550, 3600, 3650];
                        expenseData = [1700, 2140, 1980];
                        break;
                    case 'year':
                        labels = [
                            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                        ];
                        incomeData = [3400, 3450, 3500, 3550, 3600, 3650, 3700, 3750, 3800, 3850, 3900, 4000];
                        expenseData = [1900, 2100, 1950, 2140, 2000, 2300, 2200, 2100, 2400, 2200, 2350, 2500];
                        break;
                    default:
                        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
                        incomeData = [3200, 350, 0, 0];
                        expenseData = [520, 680, 540, 400];
                }

                // Create new chart
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Income',
                                data: incomeData,
                                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                                borderRadius: 4,
                            },
                            {
                                label: 'Expenses',
                                data: expenseData,
                                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                                borderRadius: 4,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                                align: 'end',
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

export default IncomeExpenseChart;