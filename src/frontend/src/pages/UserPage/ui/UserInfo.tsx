import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { userStore } from '@/entities/User'
import { STATUS } from '@/shared/types'
import { Card, Skeleton } from '@/shared/ui'
import userPageStore from '../model/userPage.store'
import { EditableField } from './fields/EditableField'
import { AvatarUser } from './Avatar'

interface UserInfoProps {}

const MapComponent = {
	[STATUS.INITIAL]: () => <UserInfoLoading />,
	[STATUS.LOADING]: () => <UserInfoLoading />,
	[STATUS.SUCCESS]: () => <UserInfoSuccess />,
	[STATUS.ERROR]: () => <UserInfoError />,
}

const UserInfoLoading = () => {
	return (
		<>
			<div className="flex justify-center sm:justify-start">
				<Skeleton className="h-32 w-32 rounded-full" />
			</div>
			<div className="flex flex-col gap-0.5">
				<p className="mb-4 p-1 text-xl font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Логин пользователя
				</p>
				<Skeleton className="h-6 w-full max-w-[300px] rounded-md" />
			</div>
			<div className="flex flex-col gap-0.5">
				<p className="mb-4 p-1 text-xl font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Имя пользователя
				</p>
				<Skeleton className="h-6 w-full max-w-[300px] rounded-md" />
			</div>
		</>
	)
}

const UserInfoError = () => {
	return (
		<div className="min-h-[318px] text-center text-red-500">
			Ошибка при загрузке данных пользователя
		</div>
	)
}

const UserInfoSuccess = observer(() => {
	return (
		<>
			<div className="flex justify-center sm:justify-start">
				<AvatarUser
					id={userStore.currentUser?.id || ''}
					name={
						userStore.currentUser?.fullname ||
						userStore.currentUser?.login ||
						''
					}
				/>
			</div>
			<EditableField
				disabled={!userPageStore.editedUser}
				defaultValue={userStore.currentUser?.login}
				title="Логин пользователя"
			/>
			<EditableField
				disabled={!userPageStore.editedUser}
				defaultValue={userStore.currentUser?.fullname}
				title="Имя пользователя"
			/>
		</>
	)
})

export const UserInfo: FC<UserInfoProps> = observer(() => {
	useEffect(() => {
		userStore.fetchCurrentUser()

		return () => {
			userPageStore.reset()
		}
	}, [])

	const Component = MapComponent[userStore.status] || null
	if (!Component) return null

	return (
		<Card className="max-h-80 w-full max-w-full p-4 lg:max-w-[420px]">
			<Component />
		</Card>
	)
})
