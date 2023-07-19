import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import { apiSignIn, apiSignOut, apiSignUp } from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import { ORGINAZATION } from 'constants/roles.constant'
import { apiSetEmployeePassword } from 'services/orginazationService'

function useAuth() {
    const dispatch = useDispatch()

    const navigate = useNavigate()

    const query = useQuery()

    const { token, signedIn } = useSelector((state) => state.auth.session)

    const signIn = async (values) => {
        try {
            const resp = await apiSignIn(values)
            if (resp.data?.data) {
                const { token } = resp.data.data
                dispatch(onSignInSuccess(token))
                if (resp.data.data) {
                    const {
                        name,
                        mailingAddress,
                        empName,
                        empEmail,
                        _id,
                        role,
                    } = resp.data.data
                    dispatch(
                        setUser({
                            name: name || empName,
                            email: mailingAddress || empEmail,
                            _id,
                            authority: [role],
                        })
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signUp = async (values) => {
        try {
            const resp = await apiSignUp(values)
            if (resp.data?.data) {
                const { token } = resp.data.data
                dispatch(onSignInSuccess(token))
                if (resp.data?.data) {
                    const { name, mailingAddress, _id } = resp.data.data
                    dispatch(
                        setUser({
                            name,
                            email: mailingAddress,
                            _id,
                            authority: [ORGINAZATION],
                        })
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const setEmployeePassword = async (values) => {
        try {
            const resp = await apiSetEmployeePassword(values)
            if (resp.data?.data) {
                const { token } = resp.data.data
                dispatch(onSignInSuccess(token))
                if (resp.data?.data) {
                    const { empName, empEmail, _id, role } = resp.data.data
                    dispatch(
                        setUser({
                            name: empName,
                            email: empEmail,
                            _id,
                            authority: [role],
                        })
                    )
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
                return {
                    status: 'success',
                    message: '',
                }
            }
        } catch (errors) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const handleSignOut = () => {
        dispatch(onSignOutSuccess())
        dispatch(setUser(initialState))
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    const signOut = async () => {
        // await apiSignOut()
        handleSignOut()
    }

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
        setEmployeePassword,
    }
}

export default useAuth
