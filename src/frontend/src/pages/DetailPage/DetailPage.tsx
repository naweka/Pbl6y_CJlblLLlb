import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { STATUS } from '@/shared/types'
import { Spinner } from '@/shared/ui'
import { detailPageStore } from './model'
import { Header, Main } from './ui'

const MapComponent: Record<STATUS, FC> = {
	[STATUS.INITIAL]: () => <ComponentLoading />,
	[STATUS.LOADING]: () => <ComponentLoading />,
	[STATUS.ERROR]: () => <ComponentError />,
	[STATUS.SUCCESS]: () => <ComponentSuccess />,
}

const ComponentError: FC = () => {
	return (
		<div className="flex flex-grow items-center justify-center">
			Что-то пошло не так...
		</div>
	)
}

const ComponentLoading: FC = () => {
	return (
		<div className="flex w-full flex-grow items-center justify-center">
			<Spinner />
		</div>
	)
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
		return () => {
			detailPageStore.reset()
		}
	}, [])

	const Component = MapComponent[detailPageStore.status] || null
	if (!Component) return null
	return <Component />
})
