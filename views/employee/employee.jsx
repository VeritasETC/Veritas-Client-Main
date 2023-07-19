import React, { useEffect, useState } from 'react'
import { IoIosAdd } from 'react-icons/io'
import { Button } from 'components/ui'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllEmployee } from 'store/orginazation/orginazationSlice'
import EmployeeList from 'components/Employee/EmployeeList'
import { useNavigate } from 'react-router-dom'

const Employee = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { orginazation } = useSelector((state) => state.orginazation)

    useEffect(() => {
        dispatch(fetchAllEmployee())
    }, [])

    const columns = [
        {
            header: 'ID',
            accessorKey: '_id',
        },
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Job Title',
            accessorKey: 'jobTitle',
        },
        {
            header: 'Wallet Address',
            accessorKey: 'walletAddress',
        },
        {
            header: 'Action',
            accessorKey: 'action',
        },
    ]

    const data = orginazation.allEmployees?.map((employee) => {
        return {
            name: employee.empName,
            email: employee.empEmail,
            jobTitle: employee.jobTitle,
            walletAddress: employee.walletAddress,
            _id: employee._id,
        }
    })

    return (
        <div>
            <div className="flex justify-end mb-10">
                <Button
                    onClick={() => navigate(`/employee-add`)}
                    className="mr-2"
                    variant="twoTone"
                    icon={<IoIosAdd />}
                >
                    <span>
                        <span>Add New Employee</span>
                    </span>
                </Button>
            </div>
            {/* <EmployeeAddModal
                addNewEmployee={addNewEmployee}
                isTransactionLoading={isTransactionLoading}
            /> */}

            {data && (
                <EmployeeList
                    columns={columns}
                    data={data}
                    allEmployee={orginazation.allEmployees}
                />
            )}
        </div>
    )
}

export default Employee
