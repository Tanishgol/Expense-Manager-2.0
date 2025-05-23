import React, { useState, useEffect } from 'react';
import { DollarSignIcon, ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OverviewCard from './overviewcard';
import BalanceChart from './balancechart'
import { RecentTransactions } from '../transactions/recenttransactions'
import { BudgetSummary } from '../budget/budgetsummery'

const Overview = () => {
    const [loading, setLoading] = useState(true);
    const [overviewData, setOverviewData] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        previousMonthIncome: 0,
        previousMonthExpenses: 0
    });
    const { token } = useAuth();
    const navigate = useNavigate();

    const calculateOverviewData = (transactions) => {
        const data = {
            totalIncome: 0,
            totalExpenses: 0,
            previousMonthIncome: 0,
            previousMonthExpenses: 0
        };

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        transactions.forEach(tx => {
            const txDate = new Date(tx.date);
            const txMonth = txDate.getMonth();
            const txYear = txDate.getFullYear();
            const isCurrentMonth = txMonth === currentMonth && txYear === currentYear;
            const isPreviousMonth = (txMonth === currentMonth - 1 && txYear === currentYear) ||
                (currentMonth === 0 && txMonth === 11 && txYear === currentYear - 1);

            if (tx.amount > 0) {
                if (isCurrentMonth) {
                    data.totalIncome += tx.amount;
                } else if (isPreviousMonth) {
                    data.previousMonthIncome += tx.amount;
                }
            } else {
                if (isCurrentMonth) {
                    data.totalExpenses += Math.abs(tx.amount);
                } else if (isPreviousMonth) {
                    data.previousMonthExpenses += Math.abs(tx.amount);
                }
            }
        });

        data.totalBalance = data.totalIncome - data.totalExpenses;
        data.previousMonthBalance = data.previousMonthIncome - data.previousMonthExpenses;

        // Calculate savings rate
        data.savingsRate = data.totalIncome > 0
            ? ((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100
            : 0;

        // Calculate previous month's savings rate
        data.previousMonthSavingsRate = data.previousMonthIncome > 0
            ? ((data.previousMonthIncome - data.previousMonthExpenses) / data.previousMonthIncome) * 100
            : 0;

        return data;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateChange = (current, previous) => {
        if (!previous) return '+0%';
        const change = ((current - previous) / previous) * 100;
        return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    };

    useEffect(() => {
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

                const transactions = await response.json();
                const data = calculateOverviewData(transactions);
                setOverviewData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                toast.error('Failed to load overview data');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [token]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard
                    title="Total Balance"
                    value={formatCurrency(overviewData.totalBalance)}
                    change={calculateChange(overviewData.totalBalance, overviewData.previousMonthBalance)}
                    positive={overviewData.totalBalance >= 0}
                    icon={<DollarSignIcon className="text-white" size={20} />}
                    color="bg-indigo-600"
                />
                <OverviewCard
                    title="Income"
                    value={formatCurrency(overviewData.totalIncome)}
                    change={calculateChange(overviewData.totalIncome, overviewData.previousMonthIncome)}
                    positive={true}
                    icon={<ArrowUpIcon className="text-white" size={20} />}
                    color="bg-green-600"
                />
                <OverviewCard
                    title="Expenses"
                    value={formatCurrency(overviewData.totalExpenses)}
                    change={calculateChange(overviewData.totalExpenses, overviewData.previousMonthExpenses)}
                    positive={false}
                    icon={<ArrowDownIcon className="text-white" size={20} />}
                    color="bg-red-500"
                />
                <OverviewCard
                    title="Savings Rate"
                    value={`${overviewData.savingsRate.toFixed(1)}%`}
                    change={calculateChange(overviewData.savingsRate, overviewData.previousMonthSavingsRate)}
                    positive={overviewData.savingsRate >= 0}
                    icon={<TrendingUpIcon className="text-white" size={20} />}
                    color="bg-blue-500"
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Monthly Balance
                    </h2>
                    <BalanceChart />
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Budget Summary
                    </h2>
                    <BudgetSummary />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent Transactions
                    </h2>
                    <button 
                        onClick={() => navigate('/transactions')}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        View All
                    </button>
                </div>
                <RecentTransactions />
            </div>
        </div>
    );
};

export default Overview;