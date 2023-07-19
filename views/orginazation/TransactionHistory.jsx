import React, { useMemo, useState, useEffect } from 'react'
import { Avatar, Badge, Button, Card } from 'components/ui'
import { DataTable } from 'components/shared'
import {
    HiOutlineSwitchHorizontal,
    HiOutlineArrowUp,
    HiOutlineArrowDown,
} from 'react-icons/hi'

import dayjs from 'dayjs'
import {
    getAllPayoutsTransactions,
    getPendingPayouts,
} from 'store/orginazation/orginazationSlice'
import { useNavigate } from 'react-router-dom'
import { convertPrice } from 'utils/ethToUsd'
import { useDispatch, useSelector } from 'react-redux'

const TransactionHistory = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orginazation } = useSelector((state) => state.orginazation)

    const { pendingPayouts, allTransactions } = orginazation

    const [payoutData, setPayoutData] = useState([])

    useEffect(() => {
        dispatch(getPendingPayouts())
        dispatch(getAllPayoutsTransactions())
    }, [])

    useEffect(() => {
        ;(async () => {
            const payoutDataa = []
            for await (let item of pendingPayouts) {
                const data = {
                    name: item.empName,
                    date: new Date(item.payDate).toLocaleDateString(),
                    price: Number(item.salary),
                    status: 'Pending',
                }

                const amount = await convertPrice(Number(item.salary), 'eth')
                data['amount'] = amount
                payoutDataa.push(data)
            }

            for await (let item of allTransactions) {
                const data = {
                    name: item?.employeeId?.empName,
                    date: new Date(item?.transactionDate).toLocaleDateString(),
                    price: Number(item?.employeeId?.salary),
                    status: item?.status,
                    amount: item.amount,
                }
                payoutDataa.push(data)
            }
            if (payoutDataa.length) {
                setPayoutData(payoutDataa)
            }
        })()
    }, [allTransactions])

    const columns = useMemo(
        () => [
            {
                header: 'Name',
                accessorKey: 'action',
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
                            <span className="font-semibold heading-text whitespace-nowrap">
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
        ],
        []
    )

    return (
        <div>
            <h2 className="font-[500] mb-10 block">Payouts</h2>

            <DataTable
                columns={columns}
                data={payoutData}
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
    )
}

export default TransactionHistory
