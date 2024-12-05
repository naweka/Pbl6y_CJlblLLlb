import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { Loading } from '@/entities/Loading'
import { userStore } from '@/entities/User'
import { STATUS } from '@/shared/types'

export const Component: FC = observer(() => {
	useEffect(() => {
		userStore.fetchCurrentUser()
	}, [])

	if (userStore.status === STATUS.LOADING) {
		return <Loading />
	}

	return (
		<main className="my-5 flex flex-grow flex-col items-center justify-center px-2">
			<div>{JSON.stringify(userStore.currentUser)}</div>
			<div>Профиль пользователя</div>
		</main>
	)
})
