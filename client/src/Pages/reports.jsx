import React from 'react'
import Report from '../Components/reports/report';

const Reports = () => {
    return (
        <>
            <div className='flex-1 overflow-y-auto p-4 md:p-6 bg-white dark:bg-dark-bg'>
                <Report />
            </div>
        </>
    )
}

export default Reports;