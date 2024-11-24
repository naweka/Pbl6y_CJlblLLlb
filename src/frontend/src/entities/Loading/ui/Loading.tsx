import { Loading as LoadingUI } from '@/shared/ui'
import { FC } from 'react'

interface LoadingProps { }

export const Loading: FC<LoadingProps> = () => {
    return (
        <div className='flex flex-grow justify-center items-center h-full'><LoadingUI /></div>
    )
}
