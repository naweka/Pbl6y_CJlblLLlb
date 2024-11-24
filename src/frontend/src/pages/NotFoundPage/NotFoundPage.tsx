import { FC } from 'react'

interface NotFoundPageProps { }

export const NotFoundPage: FC<NotFoundPageProps> = () => {
    return (
        <main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-10 pt-3">
            404
        </main>
    )
}
