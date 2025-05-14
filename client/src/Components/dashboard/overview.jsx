import React from 'react'
import OverviewCard from './overviewcard';
import { BalanceChart } from './balancechart'
import { RecentTransactions } from '../transactions/recenttransactions'
import { BudgetSummary } from '../budget/budgetsummery'
import {
    ArrowUpIcon,
    ArrowDownIcon,
    DollarSignIcon,
    TrendingUpIcon,
} from 'lucide-react'
export const Overview = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <OverviewCard
                    title="Total Balance"
                    value="$5,240.00"
                    change="+2.5%"
                    positive={true}
                    icon={<DollarSignIcon className="text-white" size={20} />}
                    color="bg-indigo-600"
                />
                <OverviewCard
                    title="Income"
                    value="$3,580.00"
                    change="+4.1%"
                    positive={true}
                    icon={<ArrowUpIcon className="text-white" size={20} />}
                    color="bg-green-600"
                />
                <OverviewCard
                    title="Expenses"
                    value="$2,140.00"
                    change="+0.8%"
                    positive={false}
                    icon={<ArrowDownIcon className="text-white" size={20} />}
                    color="bg-red-500"
                />
                <OverviewCard
                    title="Savings Rate"
                    value="28%"
                    change="+3.2%"
                    positive={true}
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
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">
                        View All
                    </button>
                </div>
                <RecentTransactions />
            </div>
        </div>
    )
}

export default Overview