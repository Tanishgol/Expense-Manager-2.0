import React from 'react'
import Transaction from '../Components/transactions/transaction';

const Transactions = () => {
    return (
        <>
            <div className='flex-1 overflow-y-auto p-4 md:p-6'>
                <Transaction />
            </div>
        </>
    )
}

export default Transactions;