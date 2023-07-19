import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PaymentHistory from 'components/Orginazation/CustomerDetails/PaymentHistory'

const PayoutHistory = () => {
    const { orginazation } = useSelector((state) => state.orginazation)

    const data = orginazation.transactions?.map((transaction) => {
        return {
            _id: transaction._id,
            transactionHash: transaction.transactionHash,
            fromAddress: transaction.fromAddress,
            toAddress: transaction.toAddress,
            amount: transaction.amount,
            transactionDate: new Date(
                transaction.transactionDate
            ).toLocaleDateString(),
        }
    })

    return <div>{data && <PaymentHistory data={data} />}</div>
}

export default PayoutHistory
