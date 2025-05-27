import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const CategoryDistributionChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: [
                            'Housing',
                            'Food',
                            'Transportation',
                            'Entertainment',
                            'Utilities',
                            'Healthcare',
                            'Shopping',
                            'Other',
                        ],
                        datasets: [
                            {
                                data: [1200, 420, 240, 180, 185, 75, 250, 90],
                                backgroundColor: [
                                    'rgba(59, 130, 246, 0.8)',
                                    'rgba(34, 197, 94, 0.8)',
                                    'rgba(168, 85, 247, 0.8)',
                                    'rgba(245, 158, 11, 0.8)',
                                    'rgba(239, 68, 68, 0.8)',
                                    'rgba(236, 72, 153, 0.8)',
                                    'rgba(79, 70, 229, 0.8)',
                                    'rgba(107, 114, 128, 0.8)',
                                ],
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
    }, []);

    return (
        <div className="h-80 w-full">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default CategoryDistributionChart;