import React, { useEffect, useState } from 'react'
import { Card, Avatar, toast, Notification, Segment } from '../../components/ui'
import { FaUserAlt } from 'react-icons/fa'
import { BsCurrencyDollar } from 'react-icons/bs'
import TransactionHistory from '../../components/Orginazation/TransactionHistory'
import GrowShrink from '../../components/shared/GrowShrink'
import { useDispatch, useSelector } from 'react-redux'
import {
    fetchAllEmployee,
    getTodayAttendances,
    getPendingPayouts,
    getAllLeaveRequests,
} from 'store/orginazation/orginazationSlice'
import {
    apiGetAmountPaidThisMonth,
    apiGetEmployeeGainedCurrentMonth,
    apiGetUpcommingPayouts,
    apiUpdateEmployeeAttendance,
    apiUpdateLeaveRequest,
} from 'services/orginazationService'
import { convertPrice } from 'utils/ethToUsd'
import WorkTimeTable from 'components/Orginazation/WorkTimeTable'
import LeaveRequestTabel from 'components/Orginazation/LeaveRequestTabel'
import Chart from 'components/Orginazation/Chart'

const OrginazationHome = () => {
    const dispatch = useDispatch()
    const { orginazation } = useSelector((state) => state.orginazation)

    const [employeeGained, setEmployeeGained] = useState(0)
    const [amountPaidThisMonth, setAmountPaidThisMonth] = useState(0)
    const [upCommingPayouts, setUpCommingPayouts] = useState(0)
    const [leaveStatus, setLeaveStatus] = useState('pending')

    useEffect(() => {
        dispatch(fetchAllEmployee())
        dispatch(getTodayAttendances())

        apiGetEmployeeGainedCurrentMonth()
            .then((res) => {
                const data = res.data?.data?.numberofdocuments
                setEmployeeGained(data)
            })
            .catch((err) => console.log(err))
        apiGetAmountPaidThisMonth()
            .then((res) => {
                let data = res.data?.data
                if (data) {
                    console.log(data)
                    data = data[0]?.totalAmount?.$numberDecimal
                    convertPrice(data, 'usd').then((usdPrice) => {
                        setAmountPaidThisMonth(usdPrice.toFixed(2))
                    })
                }
            })
            .catch((err) => console.log(err))

        apiGetUpcommingPayouts()
            .then((res) => {
                let data = res.data?.data
                if (data) {
                    data = data?.$numberDecimal
                    setUpCommingPayouts(data)
                }
            })
            .catch((err) => console.log(err))

        dispatch(getPendingPayouts())
    }, [])
    useEffect(() => {
        dispatch(getAllLeaveRequests({ status: leaveStatus }))
    }, [leaveStatus])

    const showNotification = (message, type) => {
        toast.push(<Notification type={type}>{message}</Notification>)
    }

    const handleEmployeeWorkHourStatus = async (data) => {
        apiUpdateEmployeeAttendance(data).then(async (res) => {
            await dispatch(getTodayAttendances()).unwrap()
            showNotification(res?.data?.message, 'success')
        })
    }

    const handleLeaveRequest = async (id, status) => {
        const response = await apiUpdateLeaveRequest({
            status,
            id,
        })
        dispatch(getAllLeaveRequests({ status }))
        showNotification(response.data?.message, 'success')
    }

    return (
        <div>
            <div className="flex gap-5 mb-10">
                <Card className="w-[400px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<FaUserAlt />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {orginazation?.allEmployees?.length}
                                </h3>
                                <p className="font-semibold">{'Employees'}</p>
                            </div>
                            <p className="flex items-center gap-1">
                                <GrowShrink value={employeeGained} />
                                <span>this month</span>
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="w-[400px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<BsCurrencyDollar />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {amountPaidThisMonth}
                                </h3>
                                <p className="font-semibold">{'$'}</p>
                            </div>
                            <p className="flex items-center gap-1">
                                <GrowShrink value={amountPaidThisMonth} />
                                <span>this month</span>
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="w-[400px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<BsCurrencyDollar />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {upCommingPayouts}
                                </h3>
                                <p className="font-semibold">
                                    {'Upcomming Payout'}
                                </p>
                            </div>
                            <p className="flex items-center gap-1">
                                {/* <GrowShrink value={100} />
                                <span>this month</span> */}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {orginazation.pendingPayouts?.length >= 1 && (
                <TransactionHistory
                    pendingPayouts={orginazation.pendingPayouts}
                />
            )}

            <h4 className="font-normal mt-[50px] mb-5">Manage Timesheet</h4>
            <WorkTimeTable
                orginazation={orginazation}
                handleEmployeeWorkHourStatus={handleEmployeeWorkHourStatus}
            />

            <div className="border border-gray-500 rounded-xl p-8 mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="font-normal">Leave Request</h4>
                    <div>
                        <Segment
                            defaultValue="pending"
                            onChange={(e) => setLeaveStatus(e[0])}
                        >
                            <Segment.Item value="pending">Pending</Segment.Item>
                            <Segment.Item value="approved">
                                Approved
                            </Segment.Item>
                            <Segment.Item value="rejected">
                                Rejected
                            </Segment.Item>
                        </Segment>
                    </div>
                </div>
                <LeaveRequestTabel
                    leaveRequests={orginazation?.leaveRequests}
                    handleLeaveRequest={handleLeaveRequest}
                />
            </div>
        </div>
    )
}

export default OrginazationHome
