import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BalanceChart = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/transactions', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch transactions');

            return await response.json();
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load chart data');
            return [];
        }
    };

    const processTransactionData = (transactions) => {
        const monthly = {
            income: Array(12).fill(0),
            expenses: Array(12).fill(0)
        };

        transactions.forEach((tx) => {
            try {
                const date = new Date(tx.date);
                const month = date.getUTCMonth(); 

                if (isNaN(month)) throw new Error('Invalid date');
                if (typeof tx.amount !== 'number') throw new Error('Amount is not a number');

                if (tx.amount > 0) {
                    monthly.income[month] += tx.amount;
                } else {
                    monthly.expenses[month] += Math.abs(tx.amount);
                }

            } catch (error) {
                console.warn('Skipping transaction due to error:', tx, error.message);
            }
        });

        console.log('Monthly Totals:', monthly);
        return monthly;
    };

    const renderChart = (ctx, data) => {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                ],
                datasets: [
                    {
                        label: 'Income',
                        data: data.income,
                        borderColor: 'rgb(34, 197, 94)',
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        tension: 0.3,
                        fill: true,
                    },
                    {
                        label: 'Expenses',
                        data: data.expenses,
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
                        position: 'top',
                        align: 'end',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label || '';
                                const amount = context.parsed.y ?? 0;
                                return `${label}: ${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(amount)}`;
                            },
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `$${value}`,
                        },
                    },
                },
            },
        });
    };

    useEffect(() => {
        const setupChart = async () => {
            const transactions = await fetchTransactions();
            const data = processTransactionData(transactions);

            if (chartRef.current) {
                const ctx = chartRef.current.getContext('2d');
                if (chartInstance.current) chartInstance.current.destroy();
                chartInstance.current = renderChart(ctx, data);
            }

            setLoading(false);
        };

        setupChart();

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [token]);

    return loading ? (
        <div className="h-72 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    ) : (
        <div className="h-72">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default BalanceChart;
