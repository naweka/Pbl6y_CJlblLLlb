import { FC, useEffect } from 'react'
import { Header, Main } from './ui'
import { observer } from 'mobx-react-lite'
import { detailPageStore } from './model'
import { STATUS } from '@/shared/types'
import { Spinner } from '@/shared/ui'

const MapComponent: Record<STATUS, FC> = {
    [STATUS.INITIAL]: () => <ComponentLoading />,
    [STATUS.LOADING]: () => <ComponentLoading />,
    [STATUS.ERROR]: () => <ComponentError />,
    [STATUS.SUCCESS]: () => <ComponentSuccess />
}

const ComponentError: FC = () => {
    return <div className='flex justify-center items-center flex-grow'>Что-то пошло не так...</div>
}

const ComponentLoading: FC = () => {
    return <div className='flex justify-center items-center w-full flex-grow'><Spinner /></div>
}

const ComponentSuccess: FC = () => {
    return (
        <main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-10 pt-5">
            <Header />
            <Main />
        </main>
    )
}

export const Component: FC = observer(() => {
    useEffect(() => {
        detailPageStore.fetchDetailPage()
    }, [])
    const Component = MapComponent[detailPageStore.status] || null
    if (!Component) return null
    return <Component />
})
