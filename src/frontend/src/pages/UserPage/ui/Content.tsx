import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { userStore } from '@/entities/User'
import { Card } from '@/shared/ui'
import userPageStore from '../model/userPage.store'
import { EditableField } from './fields/EditableField'
import { AvatarUser } from './Avatar'

interface ContentProps {}

export const Content: FC<ContentProps> = observer(() => {
	return (
		<div className="flex w-full flex-col items-center gap-1 sm:items-start">
			<Card className="w-full max-w-full p-4 sm:max-w-[420px]">
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
			</Card>
		</div>
	)
})
