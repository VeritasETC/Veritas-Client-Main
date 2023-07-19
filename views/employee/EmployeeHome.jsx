import React, { useEffect, useState } from 'react'
import {
    Card,
    Avatar,
    Button,
    Input,
    Notification,
    toast,
    Tooltip,
    Alert,
    Calendar,
} from 'components/ui'
import classNames from 'classnames'
import { BsCurrencyDollar } from 'react-icons/bs'
import { BiWalletAlt } from 'react-icons/bi'
import { HiOutlineDuplicate } from 'react-icons/hi'
import { AiOutlineClockCircle } from 'react-icons/ai'
import { usePayroll } from 'utils/context/PayrollContext'
import GrowShrink from '../../components/shared/GrowShrink'
import { useSelector, useDispatch } from 'react-redux'
import {
    getAllMyLeaves,
    getAllTransactions,
    getMyAttendances,
} from 'store/orginazation/orginazationSlice'
import PaymentHistory from 'components/Orginazation/CustomerDetails/PaymentHistory'
import { useNavigate } from 'react-router-dom'
import { updateEmployeeInfo } from 'store/auth/userSlice'
import {
    apiGetWorkHours,
    apiGetWorkStatus,
    apiLeaveRequest,
    apiSetWorkHourTime,
    apiStartWorkTime,
    apiStopWorkTime,
} from 'services/employeeService'
import WorkTImeForm from 'components/Employee/WorkHourForm'
import WorkTimeTable from 'components/Orginazation/WorkTimeTable'
import Timer from 'components/Timer'
import RequestLeavePopup from 'components/Employee/RequestLeavePopup'
import LeaveRequestTabel from 'components/Orginazation/LeaveRequestTabel'

const EmployeeHome = () => {
    const [isWorkStarted, setIsWorkStarted] = useState(false)
    const { connectWallet, connectedAccount } = usePayroll()
    const [workDate, setWorkDate] = useState({
        calendar: null,
    })
    const [leaveRequestData, setLeaveRequestData] = useState({
        fromDate: new Date(),
        toDate: '',
        reason: '',
        hour: '',
        numOfDays: '',
    })
    const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false)
    const [showAddWorkHourModal, setShowAddWorkHourModal] = useState(false)

    const userInfo = useSelector((state) => state.auth.user)
    const { orginazation } = useSelector((state) => state.orginazation)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleCopyClick = (address = '') => {
        navigator.clipboard.writeText(address)
        toast.push(
            <Notification title="Copied" type="success" duration={1000} />,
            {
                placement: 'top-center',
            }
        )
    }

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

    useEffect(() => {
        if (userInfo?.data) {
            dispatch(getAllTransactions({ employeeID: userInfo?.data?._id }))
        }
    }, [userInfo])

    useEffect(() => {
        if (connectedAccount.address) {
            dispatch(
                updateEmployeeInfo({ walletAddress: connectedAccount.address })
            )
        }
    }, [connectedAccount])

    useEffect(() => {
        dispatch(getMyAttendances())

        apiGetWorkStatus()
            .then((response) => {
                setIsWorkStarted(response.data?.data?.isWorkStarted)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        dispatch(getAllMyLeaves())
    }, [])

    const handleOnLeaveRequestChange = (name, value) => {
        setLeaveRequestData({ ...leaveRequestData, [name]: value })
    }

    const showNotification = (message, type) => {
        toast.push(
            <Notification
                title={type.charAt(0).toUpperCase() + type.slice(1)}
                type={type}
            >
                {message}
            </Notification>
        )
    }

    const handleWorkTimeStart = async () => {
        await apiStartWorkTime()
            .then((response) => {
                showNotification(response.data?.message, 'success')
                apiGetWorkStatus()
                    .then((response) => {
                        setIsWorkStarted(response.data?.data?.isWorkStarted)
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                if (error.response.data?.message) {
                    showNotification(error.response.data?.message, 'danger')
                    return
                }
                showNotification(error.message, 'danger')
            })
    }
    const handleStopWorkTime = async () => {
        apiStopWorkTime()
            .then((response) => {
                showNotification(response.data?.message, 'success')
            })
            .catch((error) => {
                if (error.response.data?.message) {
                    showNotification(error.response.data?.message, 'danger')
                    return
                }
                showNotification(error.message, 'danger')
            })
    }

    const onSumitLeaveRequest = (value, setSubmitting) => {
        setSubmitting(true)
        apiLeaveRequest(value)
            .then((res) => {
                setSubmitting(false)
                showNotification(res.data?.message, 'success')
                setShowLeaveRequestModal(false)
            })
            .catch((error) => {
                setSubmitting(false)
                if (error.response.data?.message) {
                    showNotification(error.response.data?.message, 'danger')
                    return
                }
                showNotification(error.mesage, 'danger')
            })
    }

    const onSubmitWorkTime = async (value, resetForm) => {
        await apiSetWorkHourTime(value)
            .then((res) => {
                showNotification(res.data?.message, 'success')
                resetForm()
                dispatch(getMyAttendances())
            })
            .catch((error) => {
                if (error.response.data?.message) {
                    showNotification(error.response.data?.message, 'danger')
                    resetForm()
                    return
                }
                resetForm()
                showNotification(error.message, 'danger')
            })
    }

    let todayAttendance = orginazation.todayAttendances?.filter(
        (attendance) =>
            new Date(attendance.createdAt).getDate() === new Date().getDate()
    )

    return (
        <div>
            <div className="flex items-center justify-between mb-10 px-[40px]">
                <div>
                    {!isWorkStarted ? (
                        <div className="">
                            <Button size="sm" onClick={handleWorkTimeStart}>
                                Start Now
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-5">
                            {todayAttendance.length >= 1 && (
                                <Timer
                                    startTime={
                                        new Date().getTime() -
                                        new Date(
                                            todayAttendance[0].clockIn
                                        ).getTime()
                                    }
                                />
                            )}

                            <Button size="sm" onClick={handleStopWorkTime}>
                                Stop
                            </Button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-5">
                    <Button
                        size="sm"
                        onClick={() => {
                            setShowAddWorkHourModal(true)
                        }}
                    >
                        Add Manual Day
                    </Button>
                    <Button
                        onClick={() => {
                            setShowLeaveRequestModal(true)
                        }}
                        size="sm"
                    >
                        Request Leave
                    </Button>
                </div>
            </div>

            <div className="flex gap-5 mb-10 flex-wrap">
                <Card className="w-[380px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<BiWalletAlt />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {Number(connectedAccount.balance).toFixed(
                                        2
                                    )}
                                </h3>
                                <p className="font-semibold">{'ETH'}</p>
                            </div>
                            {connectedAccount.address ? (
                                <Input
                                    readOnly
                                    value={connectedAccount.address}
                                    suffix={
                                        <Tooltip title="Copy">
                                            <HiOutlineDuplicate
                                                className={classNames(
                                                    'cursor-pointer text-xl',
                                                    ``
                                                )}
                                                onClick={() =>
                                                    handleCopyClick(
                                                        connectedAccount.address
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    }
                                />
                            ) : (
                                <Button>Connect Wallet</Button>
                            )}
                        </div>
                    </div>
                </Card>
                <Card className="w-[350px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<BsCurrencyDollar />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {500}
                                </h3>
                                <p className="font-semibold">
                                    {'Previous Month pay'}
                                </p>
                            </div>
                            <p className="flex items-center gap-1">
                                <GrowShrink value={5} />
                                <span>prev month</span>
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="w-[350px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<BsCurrencyDollar />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {240}
                                </h3>
                                <p className="font-semibold">
                                    Upcomming Payout
                                </p>
                            </div>
                            <p className="flex items-center gap-1">
                                <GrowShrink value={-140} />
                                <span>this month</span>
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="w-[350px]">
                    <div className="flex items-center gap-4">
                        <Avatar
                            size={55}
                            className="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                            icon={<AiOutlineClockCircle />}
                        />

                        <div>
                            <div className="flex gap-1.5 items-end mb-2">
                                <h3 className="font-bold leading-none">
                                    {'50hr'}
                                </h3>
                                <p className="font-semibold">{'Worked'}</p>
                            </div>
                            <p className="flex items-center gap-1">
                                <GrowShrink value={'-20 hr'} />
                                <span>this month</span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {data && (
                <PaymentHistory
                    data={data}
                    showAllBtn
                    onClick={() => navigate(`/payout-history`)}
                />
            )}

            <RequestLeavePopup
                leaveRequestData={leaveRequestData}
                onSumitLeaveRequest={onSumitLeaveRequest}
                handleOnLeaveRequestChange={handleOnLeaveRequestChange}
                setShowLeaveRequestModal={setShowLeaveRequestModal}
                showLeaveRequestModal={showLeaveRequestModal}
            />

            <WorkTImeForm
                selectedDate={workDate.calendar}
                onSubmitWorkTime={onSubmitWorkTime}
                showAddWorkHourModal={showAddWorkHourModal}
                setShowAddWorkHourModal={setShowAddWorkHourModal}
                setWorkDate={setWorkDate}
            />

            <div className="mt-8">
                <h2 className="mb-5">Timesheet Overview</h2>
                <WorkTimeTable
                    orginazation={orginazation}
                    handleEmployeeWorkHourStatus={() => {}}
                />
            </div>

            <div className="border border-gray-500 rounded-xl p-8 mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="font-normal">My Leaves</h4>
                </div>
                <div>
                    {orginazation?.allLeaves.length >= 1 && (
                        <LeaveRequestTabel
                            leaveRequests={orginazation?.allLeaves}
                            handleLeaveRequest={() => {}}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmployeeHome
