import { Loading } from '@/entities/Loading'
import { STATUS } from '@/shared/types'
import { FC } from 'react'
import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { authStore } from '../model'

interface ProtectedAuthProps { }

const MapComponentStatus = {
    [STATUS.INITIAL]: () => <Loading />,
    [STATUS.LOADING]: () => <Loading />,
    [STATUS.SUCCESS]: () => <ProtectedAuthSuccess />,
    [STATUS.ERROR]: () => <ProtectedAuthError />,
}

const ProtectedAuthError = () => {
    const location = useLocation()
    return <Navigate to={ROUTE_CONSTANTS.INDEX.URL} state={{ from: location }} replace />
}

const ProtectedAuthSuccess = observer(() => {
    const location = useLocation();
    if (!authStore.isAuth) {
        return <Navigate to={ROUTE_CONSTANTS.AUTH.URL} state={{ from: location }} replace />
    }
    return (
        <Outlet />
    )
})

export const ProtectedAuth: FC<ProtectedAuthProps> = observer(() => {
    const Component = MapComponentStatus[authStore.status] ?? null
    if (!Component) return null
    return <Component />
})
