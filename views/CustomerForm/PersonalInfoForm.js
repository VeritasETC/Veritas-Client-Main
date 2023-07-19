import React, { useEffect, useState } from 'react'
import { Input, FormItem } from '../../components/ui'
import { HiUserCircle, HiMail, HiLocationMarker, HiPhone } from 'react-icons/hi'
import { RiShieldUserLine } from 'react-icons/ri'
import { MdWorkOutline, MdOutlineAttachMoney } from 'react-icons/md'
import { Field } from 'formik'
import { useSelector } from 'react-redux'

const PersonalInfoForm = (props) => {
    const { touched, errors, values } = props

    const [netPay, setNetPay] = useState({
        basic: Number(values?.basic) || 0,
        medicalAllowance: Number(values?.medicalAllowances) || 0,
        travelAllowance: Number(values?.travelAllowances) || 0,
        projectAllowance: Number(values?.projectAllowance) || 0,
        houseRentAllowance: Number(values?.houseRentAllowance) || 0,
    })

    const [netPayPrice, setNetPayPrice] = useState(0)
    console.log(touched)

    useEffect(() => {
        if (values?.basic) {
            setNetPay({ ...netPay, basic: Number(values.basic) })
        }
        if (values?.medicalAllowances) {
            setNetPay({
                ...netPay,
                medicalAllowance: Number(values.medicalAllowances),
            })
        }
        if (values?.travelAllowances) {
            setNetPay({
                ...netPay,
                travelAllowance: Number(values.travelAllowances),
            })
        }
        if (values?.projectAllowance) {
            setNetPay({
                ...netPay,
                projectAllowance: Number(values.projectAllowance),
            })
        }
        if (values?.houseRentAllowance) {
            setNetPay({
                ...netPay,
                houseRentAllowance: Number(values.houseRentAllowance),
            })
        }
    }, [values])

    // console.log(netPay)

    useEffect(() => {
        let totalPrice =
            netPay.basic +
            netPay.houseRentAllowance +
            netPay.medicalAllowance +
            netPay.projectAllowance +
            netPay.travelAllowance
        setNetPayPrice(totalPrice)
    }, [netPay, values])

    const onSetFormFile = (form, field, file) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    const auth = useSelector((state) => state.auth.user)

    let isEmployee = auth?.data?.authority[0] === 'employee'

    return (
        <>
            <FormItem
                invalid={errors.upload && touched.upload}
                errorMessage={errors.upload}
            >
                <Field name="img">
                    {({ field, form }) => {
                        const avatarProps = field.value
                            ? { src: field.value }
                            : {}
                        return (
                            <div className="flex justify-center">
                                {/* <Upload
                                    className="cursor-pointer"
                                    onChange={(files) =>
                                        onSetFormFile(form, field, files)
                                    }
                                    onFileRemove={(files) =>
                                        onSetFormFile(form, field, files)
                                    }
                                    showList={false}
                                    uploadLimit={1}
                                >
                                    <Avatar
                                        className="border-2 border-white dark:border-gray-800 shadow-lg"
                                        size={100}
                                        shape="circle"
                                        icon={<HiOutlineUser />}
                                        {...avatarProps}
                                    />
                                </Upload> */}
                            </div>
                        )
                    }}
                </Field>
            </FormItem>
            <FormItem
                label="Name"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Name"
                    component={Input}
                    prefix={<HiUserCircle className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
            >
                <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                    prefix={<HiMail className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Address"
                invalid={errors.address && touched.address}
                errorMessage={errors.address}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="address"
                    placeholder="Address"
                    component={Input}
                    prefix={<HiLocationMarker className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Phone Number"
                invalid={errors.phoneNumber && touched.phoneNumber}
                errorMessage={errors.phoneNumber}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Social Security Number"
                invalid={errors.socialNumber && touched.socialNumber}
                errorMessage={errors.socialNumber}
            >
                <Field
                    type="number"
                    autoComplete="off"
                    name="socialNumber"
                    placeholder="Social Security Number"
                    component={Input}
                    prefix={<RiShieldUserLine className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Title"
                invalid={errors.jobTitle && touched.jobTitle}
                errorMessage={errors.jobTitle}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="jobTitle"
                    placeholder="Job Title"
                    component={Input}
                    prefix={<MdWorkOutline className="text-xl" />}
                />
            </FormItem>

            {!isEmployee && (
                <>
                    <p className="mt-5 mb-2">Salary Details</p>
                    <p className="mb-4">Net Pay ${netPayPrice}</p>
                    <FormItem
                        label="Basic Pay"
                        invalid={errors.basic && touched.basic}
                        errorMessage={errors.basic}
                    >
                        <Field
                            type="number"
                            autoComplete="off"
                            name="basic"
                            placeholder="Basic Pay"
                            component={Input}
                            prefix={
                                <MdOutlineAttachMoney className="text-xl" />
                            }
                        />
                    </FormItem>
                    <FormItem
                        label="Medical Allowance"
                        invalid={
                            errors.medicalAllowances &&
                            touched.medicalAllowances
                        }
                        errorMessage={errors.medicalAllowances}
                    >
                        <Field
                            type="number"
                            autoComplete="off"
                            name="medicalAllowances"
                            placeholder="Medical Allowance"
                            component={Input}
                            prefix={
                                <MdOutlineAttachMoney className="text-xl" />
                            }
                        />
                    </FormItem>
                    <FormItem
                        label="Travel Allowance"
                        invalid={
                            errors.travelAllowances && touched.travelAllowances
                        }
                        errorMessage={errors.travelAllowances}
                    >
                        <Field
                            type="number"
                            autoComplete="off"
                            name="travelAllowances"
                            placeholder="Travel Allowance"
                            component={Input}
                            prefix={
                                <MdOutlineAttachMoney className="text-xl" />
                            }
                        />
                    </FormItem>
                    <FormItem
                        label="Project Allowance"
                        invalid={
                            errors.projectAllowance && touched.projectAllowance
                        }
                        errorMessage={errors.projectAllowance}
                    >
                        <Field
                            type="number"
                            autoComplete="off"
                            name="projectAllowance"
                            placeholder="Project Allowance"
                            component={Input}
                            prefix={
                                <MdOutlineAttachMoney className="text-xl" />
                            }
                        />
                    </FormItem>
                    <FormItem
                        label="HouseRent Allowance"
                        invalid={
                            errors.houseRentAllowance &&
                            touched.houseRentAllowance
                        }
                        errorMessage={errors.houseRentAllowance}
                    >
                        <Field
                            type="number"
                            autoComplete="off"
                            name="houseRentAllowance"
                            placeholder="HouseRent Allowance"
                            component={Input}
                            prefix={
                                <MdOutlineAttachMoney className="text-xl" />
                            }
                        />
                    </FormItem>
                </>
            )}

            {/* <FormItem
                label="Birthday"
                invalid={errors.birthday && touched.birthday}
                errorMessage={errors.birthday}
            >
                <Field name="birthday" placeholder="Date">
                    {({ field, form }) => (
                        <DatePicker
                            field={field}
                            form={form}
                            value={field.value}
                            prefix={<HiCake className="text-xl" />}
                            onChange={(date) => {
                                form.setFieldValue(field.name, date)
                            }}
                        />
                    )}
                </Field>
            </FormItem> */}
        </>
    )
}

export default PersonalInfoForm
