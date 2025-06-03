import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { DefaultSettings } from './DefaultSettings'
import { UserInfo } from './UserInfo'

interface ContentProps {}

export const Content: FC<ContentProps> = observer(() => {
	return (
		<div className="flex w-full flex-wrap items-center gap-4 sm:items-start lg:flex-nowrap">
			<UserInfo />
			<DefaultSettings />
		</div>
	)
})
