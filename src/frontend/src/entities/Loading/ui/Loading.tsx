import { FC } from 'react'
import { Loading as LoadingUI } from '@/shared/ui'

interface LoadingProps {}

export const Loading: FC<LoadingProps> = () => {
	return (
		<div className="flex h-full flex-grow items-center justify-center">
			<LoadingUI />
		</div>
	)
}
