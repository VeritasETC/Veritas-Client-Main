import { useState, useEffect, createContext, useContext } from 'react'
import {
    ethers,
    formatEther,
    formatUnits,
    parseEther,
    parseUnits,
} from 'ethers'

import {
    contractABI,
    contractAddress,
} from '../../constants/smartContract.constant'
import { useDispatch } from 'react-redux'
import { updateEmployeeInfo } from 'store/auth/userSlice'
import { saveTransactionToDB } from 'store/orginazation/orginazationSlice'

const PayrollContext = createContext()

const { ethereum } = window

const getEthereumContract = async (address) => {
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner()
    const payrollContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    )

    // balance is in wei
    let balance = await provider.getBalance(address)

    // console.log({
    //     provider,
    //     signer,
    //     payrollContract,
    // })

    return {
        payrollContract,
        balance,
        provider,
        signer,
    }
}

const PayrollProvider = ({ children }) => {
    const [connectedAccount, setConnectedAccount] = useState({
        balance: '',
        address: '',
    })
    const [isTransactionLoading, setIsTransactionLoading] = useState(false)
    const [employeeInfoOnBlock, setEmployeeInfoOnBlock] = useState(null)

    const dispatch = useDispatch()

    const getBalance = async (address) => {
        const { payrollContract, balance, provider, signer } =
            await getEthereumContract(address)

        const balanceInWei = await provider.getBalance(address)
        return formatEther(balanceInWei)
    }

    // function to check if wallet is connected or not at start
    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) {
                alert('Please Install MetaMask')
                return
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' })

            if (accounts.length) {
                dispatch(updateEmployeeInfo({ walletAddress: accounts[0] }))

                const balance = await getBalance(accounts[0])

                setConnectedAccount({
                    balance,
                    address: accounts[0],
                })
                // getAllTrasactions
            } else {
                console.log('No accounts found.')
            }
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    // function to connect the wallet
    const connectWallet = async () => {
        try {
            if (!ethereum) {
                alert('Please Install MetaMask')
                return
            }
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts',
            })

            const balance = await getBalance(accounts[0])
            setConnectedAccount({
                balance,
                address: accounts[0],
            })
            await dispatch(
                updateEmployeeInfo({ walletAddress: accounts[0] })
            ).unwrap()
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const sendTransaction = async (addressTo, amount, employeeID) => {
        try {
            if (!ethereum) {
                alert('Please Install MetaMask')
                return
            }

            if (!addressTo || !amount) {
                return
            }

            const { payrollContract, balance, provider, signer } =
                await getEthereumContract(connectedAccount.address)
            const parsedAmount = ethers.parseEther(amount)
            // console.log(parsedAmount)

            const tx = await signer.sendTransaction({
                to: addressTo,
                value: parsedAmount,
            })
            setIsTransactionLoading(true)
            console.log('Loading', tx.hash)
            const recipt = await tx.wait()
            // console.log('Done', tx.hash, 'recipt', recipt)
            // const transaction = await provider.getTransaction(tx.hash)
            // save transaction to DB
            await dispatch(
                saveTransactionToDB({
                    transactionHash: recipt.hash,
                    fromAddress: recipt.from,
                    toAddress: recipt.to,
                    amount,
                    employeeID,
                })
            )
                .unwrap()
                .catch((e) => {
                    console.log(e)
                })
            setIsTransactionLoading(false)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const getAllTrasactionsFromBlock = async () => {
        let a = '0x849e8aA327C855c761c9487590427B1B2dAd5D74'

        try {
            if (!ethereum) {
                alert('Please Install MetaMask')
                return
            }

            const { payrollContract, balance, provider, signer } =
                await getEthereumContract(connectedAccount.address)
            const tx = await payrollContract.getTrasactions(
                '0x849e8aa327c855c761c9487590427b1b2dad5d74'
            )
            // console.log(
            //     await provider.getTransaction(
            //         '0x45c194f5a95e634c259b668871fc89f677eed53e43898608b3ecd48d14669d01'
            //     )
            // )
            console.log(tx)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const addEmployeeToBlock = async ({
        employeeId,
        salary,
        taxRate,
        deductions = [0],
        isActive = true,
        isFullTime,
        paymentFrequency,
        paymentAmount,
    }) => {
        // paymentFrequency
        // 1 -> Monthly
        // 2 -> Weekly
        // 3 -> hourly
        try {
            if (!ethereum) {
                alert('Please Install MetaMask')
                return
            }

            if (
                !employeeId ||
                !salary ||
                !taxRate ||
                !isFullTime ||
                !paymentFrequency ||
                !paymentAmount
            ) {
                return
            }

            const { payrollContract, balance, provider, signer } =
                await getEthereumContract(connectedAccount.address)

            // call smartcontract functions here
            const tx = await payrollContract.addEmployee(
                employeeId,
                salary,
                taxRate,
                deductions,
                isActive,
                isFullTime,
                paymentFrequency,
                paymentAmount
            )
            console.log('Loading... ', tx.hash)
            setIsTransactionLoading(true)
            await tx.wait()
            console.log('Done... ', tx.hash)
            const transaction = await provider.getTransaction(tx.hash)
            console.log(transaction, 'tx')
            setIsTransactionLoading(false)
        } catch (error) {
            console.log(error)
            throw new Error('No ethereum object')
        }
    }

    const getEmployeeInfoFromBlock = async (employeeId) => {
        const { payrollContract, balance, provider, signer } =
            await getEthereumContract(connectedAccount.address)
        const e = await payrollContract.employees(employeeId)

        const employeeInfo = {
            id: e[0],
            salary: e[1],
            taxRate: e[2],
            isActive: e[3],
            isFullTime: e[4],
            paymentFrequency: e[5],
            paymentAmount: e[6],
            halfDay: e[7],
            sickDay: e[8],
            walletAddress: e[10],
        }

        const netPay = await payrollContract.calculateNetPay(employeeId)

        setEmployeeInfoOnBlock({ ...employeeInfo, netPay })
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <PayrollContext.Provider
            value={{
                connectWallet,
                connectedAccount,
                sendTransaction,
                addEmployeeToBlock,
                isTransactionLoading,
                getEmployeeInfoFromBlock,
                employeeInfoOnBlock,
                getAllTrasactionsFromBlock,
            }}
        >
            {children}
        </PayrollContext.Provider>
    )
}

export const usePayroll = () => {
    return useContext(PayrollContext)
}

export default PayrollProvider
