import React from 'react'
import Overview from '../Components/dashboard/overview';

const Dashboard = () => {
    return (
        <>
            <div className='flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-dark-bg'>
                <Overview />
            </div>
        </>
    )
}

export default Dashboard;