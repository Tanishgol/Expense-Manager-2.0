import React from 'react'
import {
    PieChartIcon,
    BarChart3Icon,
    TrendingUpIcon,
    EyeIcon,
    TargetIcon,
    BarChartIcon,
} from 'lucide-react'
const FeatureSection = () => {
    return (
        <div className="w-full bg-white dark:bg-dark-bg py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* What is ExpenseManager */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        What is ExpenseManager?
                    </h2>
                    <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg">
                        ExpenseManager is a comprehensive financial tool designed to help
                        individuals and businesses track, categorize, and analyze their
                        spending patterns. Our platform provides real-time insights into
                        your financial health, enabling smarter decisions about your money.
                    </p>
                </div>
                {/* Why use ExpenseManager */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                        Why Use ExpenseManager?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-blue-50 dark:bg-dark-card p-6 rounded-lg">
                            <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                                <PieChartIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Visualize Spending
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                See where your money goes with intuitive charts and graphs that
                                break down your expenses by category.
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-dark-card p-6 rounded-lg">
                            <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                                <BarChart3Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Budget Planning
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Create custom budgets for different categories and track your
                                progress to stay within your financial goals.
                            </p>
                        </div>
                        <div className="bg-blue-50 dark:bg-dark-card p-6 rounded-lg">
                            <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                                <TrendingUpIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Financial Insights
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Gain valuable insights into your spending habits and identify
                                areas where you can save money.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Purpose/Motive */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
                        Our Purpose
                    </h2>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-dark-card dark:to-dark-bg rounded-xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Financial Freedom Through Awareness
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    We believe that financial freedom starts with awareness. Our
                                    mission is to empower you with the tools and insights needed
                                    to understand your spending habits, make informed decisions,
                                    and achieve your financial goals.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <EyeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                                        </div>
                                        <p className="ml-3 text-gray-600 dark:text-gray-300">
                                            Promote financial transparency and awareness
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <TargetIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                                        </div>
                                        <p className="ml-3 text-gray-600 dark:text-gray-300">
                                            Help users reach their savings and investment goals
                                        </p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <BarChartIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                                        </div>
                                        <p className="ml-3 text-gray-600 dark:text-gray-300">
                                            Enable data-driven financial decisions
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                                    alt="Financial planning"
                                    className="rounded-lg shadow-lg max-w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FeatureSection