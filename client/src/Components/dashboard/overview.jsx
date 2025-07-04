import React, { useState, useEffect } from 'react';
import { DollarSignIcon, ArrowUpIcon, ArrowDownIcon, TrendingUpIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import OverviewCard from './overviewcard';
import BalanceChart from './balancechart'
import { RecentTransactions } from '../transactions/recenttransactions'
import { BudgetSummary } from '../budget/budgetsummery'
import TransactionService from '../../services/transactionService'

const Overview = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overviewData, setOverviewData] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalExpenses: 0,
        previousMonthIncome: 0,
        previousMonthExpenses: 0
    });
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUserName(parsedUser.fullName || 'User');
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUserName('User');
            }
        }
    }, []);

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

        data.savingsRate = data.totalIncome > 0
            ? ((data.totalIncome - data.totalExpenses) / data.totalIncome) * 100
            : 0;

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
        let ignore = false;

        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await TransactionService.getAllTransactions();
                if (!ignore) {
                    const uniqueTransactions = Array.from(new Map(data.map(tx => [tx._id, tx])).values());
                    setTransactions(uniqueTransactions);
                    setOverviewData(calculateOverviewData(uniqueTransactions));
                }
            } catch (error) {
                if (!ignore) {
                    setError(error);
                    toast.error('Failed to fetch transactions');
                    setTransactions([]);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            ignore = true;
        };
    }, [token, navigate]);

    if (loading || error) {
        return (
            <div className="space-y-6 mt-14">
                <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="space-y-2">
                            {[...Array(11)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex justify-between items-center mb-4">
                        <div className="h-5 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-14">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 md:text-left xs:text-center xss:text-center xsss:text-center">
                Dashboard, Welcome back{" "}
                <span className="px-1 text-blue-700 dark:text-blue-400">
                    {userName}
                </span>
            </h1>
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
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                        Monthly Balance
                    </h2>
                    <BalanceChart />
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300 mb-4">
                        Budget Summary
                    </h2>
                    <BudgetSummary />
                </div>
            </div>
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">
                        Recent Transactions
                    </h2>
                    <button
                        onClick={() => navigate('/transactions')}
                        className="text-sm text-indigo-600 font-medium hover:text-indigo-800 dark:text-indigo-600 dark:hover:text-indigo-800"
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