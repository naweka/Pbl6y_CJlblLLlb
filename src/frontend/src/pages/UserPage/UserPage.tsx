import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'

import { Loading } from '@/entities/Loading'
import { userStore } from '@/entities/User'
import { STATUS } from '@/shared/types'

import { Header } from './ui/Header'
import { Content } from './ui/Content'
import userPageStore from './model/userPage.store'

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
		<main className="mx-auto w-full max-w-layout  gap-5 pt-5 flex flex-grow flex-col px-2">
			<Header />
			<Content />
		</main >
	)
})
