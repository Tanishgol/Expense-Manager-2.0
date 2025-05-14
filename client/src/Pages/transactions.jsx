import React from 'react'
import TransactionItem from '../Components/transactions/transactionitem';
import RecentTransactions from '../Components/transactions/RecentTransactions';
import Transaction from '../Components/transactions/transaction';

const Transactions = () => {
    return (
        <>
            <TransactionItem />
            <RecentTransactions />
            <Transaction />
        </>
    )
}

export default Transactions;