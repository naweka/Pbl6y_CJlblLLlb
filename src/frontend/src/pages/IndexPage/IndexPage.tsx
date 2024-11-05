import { FC } from 'react'
import { Content } from './ui/Content'
import { Header } from './ui/Header'

export const Component: FC = () => {
	return (
		<main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-10 pt-3">
			<Header />
			<Content />
		</main>
	)
}
