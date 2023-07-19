import React, { useState } from 'react'
import * as Yup from 'yup'
import {
    Input,
    Button,
    Checkbox,
    FormItem,
    FormContainer,
    Dialog,
    DatePicker,
    Alert,
    Select,
} from '../../components/ui'
import { Field, Form, Formik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { createNewEmployee } from '../../store/orginazation/orginazationSlice'
import { usePayroll } from '../../utils/context/PayrollContext'

const EmployeeAddPage = (props) => {
    const dispatch = useDispatch()
    const { addEmployeeToBlock, isTransactionLoading } = usePayroll()

    const addNewEmployee = async (employeeData) => {
        const data = await dispatch(createNewEmployee(employeeData)).unwrap()
        const id = data?.data?._id
        const { salary, taxRate, paymentAmount, paymentFrequency, isFullTime } =
            employeeData

        addEmployeeToBlock({
            employeeId: id,
            salary,
            taxRate,
            isFullTime,
            paymentFrequency,
            paymentAmount,
        })
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email Required'),
        name: Yup.string()
            .min(3, 'Too Short!')
            .max(40, 'Too Long!')
            .required('Name Required'),
        jobTitle: Yup.string()
            .min(3, 'Too Short!')
            .max(100, 'Too Long!')
            .required('Job Title Required'),
        paymentFrequency: Yup.string().required('Please select one!'),
        salary: Yup.string().required('Salary Required'),
        paymentAmount: Yup.string().required('Paymnet Amount Required'),
        taxRate: Yup.string().required('Tax Rate Required'),
        rememberMe: Yup.bool(),
    })

    const orginazationData = useSelector((state) => state.orginazation)

    const paymentFrequencyOptions = [
        {
            label: 'Monthly',
            value: 1,
        },
        {
            label: 'Weekly',
            value: 2,
        },
        {
            label: 'Hourly',
            value: 3,
        },
    ]

    return (
        <div>
            {orginazationData.orginazation.error && (
                <Alert className="mb-4" type="danger" showIcon closable>
                    {orginazationData.orginazation.error}
                </Alert>
            )}
            {orginazationData.orginazation.message && (
                <Alert className="mb-4" type="success" showIcon closable>
                    {orginazationData.orginazation.message}
                </Alert>
            )}

            <h2 className="text-2xl mb-6">Add New Employee</h2>
            <Formik
                initialValues={{
                    email: '',
                    name: '',
                    jobTitle: '',
                    rememberMe: false,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { resetForm, setSubmitting }) => {
                    setSubmitting(true)
                    await addNewEmployee(values)
                    setSubmitting(false)
                }}
            >
                {({ touched, errors, resetForm, isSubmitting, values }) => (
                    <Form>
                        <FormContainer>
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
                                />
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
                                />
                            </FormItem>

                            <FormItem
                                label="Job Title"
                                invalid={errors.jobTitle && touched.jobTitle}
                                errorMessage={errors.jobTitle}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="jobTitle"
                                    placeholder="Job Title"
                                    component={Input}
                                />
                            </FormItem>

                            <FormItem
                                label="Tax Rate"
                                invalid={errors.taxRate && touched.taxRate}
                                errorMessage={errors.taxRate}
                            >
                                <Field
                                    type="number"
                                    autoComplete="off"
                                    name="taxRate"
                                    placeholder="Tax Rate"
                                    component={Input}
                                />
                            </FormItem>

                            <div className="grid grid-cols-2 gap-8 w-full">
                                <FormItem
                                    label="Salary"
                                    invalid={errors.salary && touched.salary}
                                    errorMessage={errors.salary}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="salary"
                                        placeholder="Salary"
                                        component={Input}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Payment Amount"
                                    invalid={
                                        errors.paymentAmount &&
                                        touched.paymentAmount
                                    }
                                    errorMessage={errors.paymentAmount}
                                >
                                    <Field
                                        type="number"
                                        autoComplete="off"
                                        name="paymentAmount"
                                        placeholder="Payment Amount"
                                        component={Input}
                                    />
                                </FormItem>
                            </div>

                            <div className="grid grid-cols-2 gap-8 w-full">
                                <FormItem
                                    label="Payment Frequency"
                                    asterisk
                                    invalid={
                                        errors.paymentFrequency &&
                                        touched.paymentFrequency
                                    }
                                    errorMessage={errors.paymentFrequency}
                                >
                                    <Field name="paymentFrequency">
                                        {({ field, form }) => (
                                            <Select
                                                field={field}
                                                form={form}
                                                options={
                                                    paymentFrequencyOptions
                                                }
                                                value={paymentFrequencyOptions.filter(
                                                    (option) =>
                                                        option.value ===
                                                        values.paymentFrequency
                                                )}
                                                onChange={(option) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        option.value
                                                    )
                                                }
                                            />
                                        )}
                                    </Field>
                                </FormItem>

                                <FormItem asterisk label="Is Full Time">
                                    <Field
                                        name="isFullTime"
                                        component={Checkbox}
                                        children="is full time"
                                    />
                                </FormItem>
                            </div>
                            <FormItem label="Start Date">
                                <Field name="startDate">
                                    {({ field, form }) => (
                                        <DatePicker
                                            field={field}
                                            form={form}
                                            value={field.value}
                                            placeholder="Start Date"
                                            onChange={(date) => {
                                                form.setFieldValue(
                                                    field.name,
                                                    date
                                                )
                                            }}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <FormItem>
                                <Button
                                    type="reset"
                                    className="ltr:mr-2 rtl:ml-2"
                                    onClick={resetForm}
                                    disabled={
                                        isSubmitting || isTransactionLoading
                                    }
                                >
                                    Reset
                                </Button>
                                <Button
                                    loading={
                                        isSubmitting || isTransactionLoading
                                    }
                                    variant="solid"
                                    type="submit"
                                    disabled={
                                        isSubmitting || isTransactionLoading
                                    }
                                >
                                    {isSubmitting
                                        ? isTransactionLoading
                                            ? 'Adding to Block...'
                                            : 'Creating...'
                                        : 'Save'}
                                </Button>
                            </FormItem>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EmployeeAddPage
