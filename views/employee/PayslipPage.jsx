import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Badge } from 'components/ui'
import { DataTable } from 'components/shared'
import { HiOutlineArrowUp } from 'react-icons/hi'
import PayslipModal from 'components/Orginazation/PayslipModal'
import { getAllMyTransactions } from 'store/employee/employeeSlice'

const PayslipsPage = () => {
    const dispatch = useDispatch()
    const { transactions, transaction } = useSelector((state) => state.employee)
    const [transactionsData, setTransactions] = useState([])
    const [showPlayslipModal, setShowPlayslipModal] = useState(false)
    const [transactionId, setTransactionId] = useState(null)

    useEffect(() => {
        dispatch(getAllMyTransactions())
    }, [])

    useEffect(() => {
        ;(async () => {
            const transactionData = []

            for await (let item of transactions) {
                const data = {
                    name: item?.employeeId?.empName,
                    date: new Date(item?.transactionDate).toLocaleDateString(),
                    price: Number(item?.employeeId?.salary),
                    status: item?.status,
                    amount: item.amount,
                    action: item._id,
                }
                transactionData.push(data)
            }
            if (transactionData.length) {
                setTransactions(transactionData)
            }
        })()
    }, [transactions])

    console.log(transactions)

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <Avatar
                                    size="sm"
                                    className="bg-red-100 text-green-600 dark:bg-green-500/20 dark:text-green-100"
                                    icon={
                                        <HiOutlineArrowUp
                                            style={{
                                                transform: 'rotate(45deg)',
                                            }}
                                        />
                                    }
                                />
                            </div>
                            <span className="font-semibold heading-text whitespace-nowrap capitalize">
                                {row.name}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Date',
                accessorKey: 'date',
                cell: (props) => {
                    const row = props.row.original
                    return <div className="flex items-center">{row.date}</div>
                },
            },
            {
                header: 'Price',
                accessorKey: 'price',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.price} USD</span>
                },
            },
            {
                header: 'Amount',
                accessorKey: 'amount',
                cell: (props) => {
                    const row = props.row.original
                    return <span>{row.amount} ETH</span>
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <Badge
                                className={
                                    status === 'Success'
                                        ? 'bg-green-500'
                                        : 'bg-amber-500'
                                }
                            />
                            <span
                                className={
                                    status === 'Success'
                                        ? `capitalize font-semibold text-green-500`
                                        : `capitalize font-semibold text-amber-500`
                                }
                            >
                                {status}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Payslip',
                accessorKey: 'action',
                cell: (props) => {
                    const { action } = props.row.original
                    return (
                        <div className="flex items-center gap-2">
                            <div>
                                <button
                                    onClick={() => openPayslipModal(action)}
                                    className="btn"
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    )
                },
            },
        ],
        []
    )

    const openPayslipModal = (transactionId) => {
        setTransactionId(transactionId)
        setShowPlayslipModal(true)
    }
    const closePayslipModal = () => {
        setShowPlayslipModal(false)
        setTransactionId(null)
    }

    return (
        <div>
            {showPlayslipModal && (
                <PayslipModal
                    showPlayslipModal={showPlayslipModal}
                    openPayslipModal={openPayslipModal}
                    closePayslipModal={closePayslipModal}
                    transactionId={transactionId}
                />
            )}
            {transactions.length >= 1 && (
                <div className="border border-gray-600 p-5 rounded-[5px]">
                    <p className="text-[28px] text-white pb-7">My Payslips</p>
                    <DataTable
                        columns={columns}
                        data={transactionsData}
                        skeletonAvatarColumns={[0]}
                        skeletonAvatarProps={{
                            size: 'sm',
                            className: 'rounded-md',
                        }}
                        // loading={loading}
                        // pagingData={tableData}
                        // onPaginationChange={onPaginationChange}
                        // onSelectChange={onSelectChange}
                        // onSort={onSort}
                        pagingData={{ pageSize: 20, pageIndex: 1, total: 1 }}
                    />
                </div>
            )}
        </div>
    )
}

export default PayslipsPage
