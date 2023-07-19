import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Tabs } from 'components/ui'
import { AdaptableCard, Container } from 'components/shared'
import { useNavigate, useLocation } from 'react-router-dom'

const Profile = lazy(() => import('../../components/Employee/Setting/Profile'))

const { TabNav, TabList } = Tabs

const settingsMenu = {
    profile: { label: 'Profile', path: 'profile' },
}

const EmployeeSettingPage = () => {
    const [currentTab, setCurrentTab] = useState('profile')
    const [data, setData] = useState({})

    const navigate = useNavigate()

    const location = useLocation()

    const path = location.pathname.substring(
        location.pathname.lastIndexOf('/') + 1
    )

    const onTabChange = (val) => {
        setCurrentTab(val)
        console.log(val)
        // navigate(`/app/account/settings/${val}`)
    }

    const fetchData = async () => {
        // const response = await apiGetAccountSettingData()
        // setData(response.data)
    }

    useEffect(() => {
        // setCurrentTab(path)
        // if (isEmpty(data)) {
        //     fetchData()
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <h2 className="block mb-5">Settings</h2>
            <Container>
                <AdaptableCard>
                    <Tabs
                        value={currentTab}
                        onChange={(val) => onTabChange(val)}
                    >
                        <TabList>
                            {Object.keys(settingsMenu).map((key) => (
                                <TabNav key={key} value={key}>
                                    {settingsMenu[key].label}
                                </TabNav>
                            ))}
                        </TabList>
                    </Tabs>
                    <div className="px-4 py-6">
                        <Suspense fallback={<></>}>
                            {currentTab === 'profile' && <Profile />}
                        </Suspense>
                    </div>
                </AdaptableCard>
            </Container>
        </div>
    )
}

export default EmployeeSettingPage
