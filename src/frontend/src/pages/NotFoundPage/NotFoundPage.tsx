import { ROUTE_CONSTANTS } from '@/shared/config'
import { Button } from '@/shared/ui'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface NotFoundPageProps { }

// TODO Сделать крутую 404

export const NotFoundPage: FC<NotFoundPageProps> = () => {
    const navigate = useNavigate()
    return (
        <main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-10 pt-3 h-full">
            <div className='flex flex-grow flex-col justify-center items-center gap-5'>
                <p className='text-9xl font-bold'>404</p>
                <p className='text-2xl font-bold'>Страница не найдена</p>
                <Button size="lg" onClick={() => navigate(ROUTE_CONSTANTS.INDEX)}>На главную страницу</Button>
            </div>
        </main>
    )
}
