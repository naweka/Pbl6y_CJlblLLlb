import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { Loading } from '@/entities/Loading'
import { userStore } from '@/entities/User'
import { STATUS } from '@/shared/types'
import userPageStore from './model/userPage.store'
import { Content } from './ui/Content'
import { Header } from './ui/Header'

export const Component: FC = observer(() => {
	useEffect(() => {
		userStore.fetchCurrentUser()

		return () => {
			userPageStore.reset()
		}
	}, [])

	if (userStore.status === STATUS.LOADING) {
		return <Loading />
	}

	return (
		<main className="mx-auto flex w-full max-w-layout flex-grow flex-col gap-5 px-2 pt-5">
			<Header />
			<Content />
		</main>
	)
})
