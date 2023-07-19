import { Spinner, Notification, toast } from '../../components/ui'
import { AdaptableCard } from 'components/shared'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    fetchEmployeeInfo,
    getAllTransactions,
} from 'store/orginazation/orginazationSlice'
import { usePayroll } from 'utils/context/PayrollContext'
import NumberFormat from 'react-number-format'

import CustomerProfile from 'components/Orginazation/CustomerDetails/CustomerProfile'
import CurrentPayoutInfo from 'components/Orginazation/CustomerDetails/CurrentPayoutInfo'
import PaymentHistory from 'components/Orginazation/CustomerDetails/PaymentHistory'
import { convertPrice } from 'utils/ethToUsd'

const EmployeeDetails = () => {
    const dispatch = useDispatch()
    const { orginazation } = useSelector((state) => state.orginazation)

    const {
        connectedAccount,
        getEmployeeInfoFromBlock,
        employeeInfoOnBlock,
        isTransactionLoading,
        connectWallet,
        sendTransaction,
    } = usePayroll()

    const params = useParams()
    const { employeeID } = params

    useEffect(() => {
        dispatch(fetchEmployeeInfo({ employeeID }))
        dispatch(getAllTransactions({ employeeID }))
    }, [])

    useEffect(() => {
        if (connectedAccount.address) {
            getEmployeeInfoFromBlock(employeeID)
        }
    }, [connectedAccount.address])

    const { employeeDetails } = orginazation

    const getPaymentFrequency = (typeNum) => {
        switch (typeNum) {
            case 1:
                return 'Monthly'
            case 2:
                return 'Weekly'
            case 3:
                return 'Hourly'
        }
    }

    const onSendTransaction = async (amount) => {
        if (!employeeDetails?.walletAddress) {
            return alert(employeeDetails?.empName + ' wallet not connected...')
        }
        if (!connectedAccount.address) {
            await connectWallet()
        }
        const amountInEth = await convertPrice(Number(amount), 'eth')
        // console.log(amountInEth)
        await sendTransaction(
            employeeDetails.walletAddress,
            String(amountInEth.toFixed(4)),
            employeeID
        )
        toast.push(
            <Notification title="Sent..." type="success" duration={1000} />,
            {
                placement: 'top-center',
            }
        )
        dispatch(fetchEmployeeInfo({ employeeID }))
        dispatch(getAllTransactions({ employeeID }))
    }

    // Transaction List
    const columns = [
        {
            header: 'Transaction Hash',
            accessorKey: 'transactionHash',
        },
        {
            header: 'From Address',
            accessorKey: 'fromAddress',
        },
        {
            header: 'To Address',
            accessorKey: 'toAddress',
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
        },
        {
            header: 'Transaction Date',
            accessorKey: 'transactionDate',
        },
    ]

    const data =
        orginazation?.transactions &&
        orginazation?.transactions?.map((transaction) => {
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

    if (orginazation.isLoading) {
        return (
            <div className="h-[80vh] w-full flex justify-center items-center">
                <Spinner className="mr-4" size="40px" />
            </div>
        )
    }

    return (
        <div>
            <div className="h-[100px] flex items-center">
                <h4 className="h-full pt-[10px] text-[40px] font-[500]">
                    Employee Details
                </h4>
            </div>

            <div className="flex flex-col xl:flex-row gap-4">
                <div>
                    <CustomerProfile employeeDetails={employeeDetails} />
                </div>
                <div className="w-full">
                    <AdaptableCard>
                        <CurrentPayoutInfo
                            onSendTransaction={onSendTransaction}
                            isTransactionLoading={isTransactionLoading}
                            employeeDetails={employeeDetails}
                            connectedAccount={connectedAccount}
                            connectWallet={connectWallet}
                        />
                        {data && <PaymentHistory data={data} />}
                        {/* <PaymentMethods data={data.paymentMethod} /> */}
                    </AdaptableCard>
                </div>
            </div>
        </div>
    )
}

export default EmployeeDetails
