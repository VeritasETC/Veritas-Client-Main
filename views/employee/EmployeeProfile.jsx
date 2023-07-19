import EmployeeProfileCard from '../../components/Employee/EmployeeProfileCard'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLoggedInEmployeeInfo } from 'store/auth/userSlice'

const EmployeeProfile = () => {
    const employeeData = useSelector((state) => state)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getLoggedInEmployeeInfo())
    }, [])

    return (
        <div>
            <h4>My Profile Information</h4>

            <div>
                {employeeData.auth?.user?.data && (
                    <EmployeeProfileCard
                        profileData={employeeData.auth?.user?.loggedInUser}
                    />
                )}
            </div>
        </div>
    )
}

export default EmployeeProfile
