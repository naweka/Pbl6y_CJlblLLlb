import { FC } from 'react'
import { Header, Main } from './ui'

export const Component: FC = () => {
    return (
        <main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-10 pt-5">
            <Header />
            <Main />
        </main>
    )
}
