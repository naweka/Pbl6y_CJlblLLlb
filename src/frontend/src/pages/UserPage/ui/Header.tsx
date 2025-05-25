import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Edit } from '@/entities/Edit'
import { Separator } from '@/shared/ui'
import userPageStore from '../model/userPage.store'

interface HeaderProps {}

export const Header: FC<HeaderProps> = observer(() => {
	return (
		<div className="w-full">
			<div className="mb-4 flex flex-col-reverse items-end justify-between gap-3 px-2 md:flex-row md:items-center">
				<p className="w-full text-center text-3xl sm:text-4xl md:text-left md:text-5xl">
					Профиль пользователя
				</p>
				<Edit
					checked={userPageStore.editedUser}
					onCheckedChange={userPageStore.setEditedUser}
				/>
			</div>
			<Separator />
		</div>
	)
})
