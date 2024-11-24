import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { authStore } from '../model'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { STATUS } from '@/shared/types'
import { Loading } from '@/entities/Loading'

interface RedirectToMainProps { }

const MapComponentStatus = {
    [STATUS.INITIAL]: () => <Loading />,
    [STATUS.LOADING]: () => <Loading />,
    [STATUS.SUCCESS]: () => <RedirectToMainSuccess />,
    [STATUS.ERROR]: () => <Outlet />,
}

const RedirectToMainSuccess = observer(() => {
    const location = useLocation();
    if (authStore.isAuth) {
        return <Navigate to={ROUTE_CONSTANTS.INDEX} state={{ from: location }} replace />
    }
    return (
        <Outlet />
    )
})

export const RedirectToMain: FC<RedirectToMainProps> = observer(() => {
    const Component = MapComponentStatus[authStore.status] ?? null
    if (!Component) return null
    return <Component />
})
