import { EMPLOYEE, ORGINAZATION } from 'constants/roles.constant'
import React from 'react'
import { useSelector } from 'react-redux'
import EmployeeHome from './employee/EmployeeHome'
import OrginazationHome from './orginazation/OrginazationHome'

const Home = () => {
    const userInfo = useSelector((state) => state.auth.user)
    if (userInfo?.data?.authority?.includes(EMPLOYEE)) {
        return <EmployeeHome />
    } else if (userInfo?.data?.authority?.includes(ORGINAZATION)) {
        return <OrginazationHome />
    }
}

export default Home
