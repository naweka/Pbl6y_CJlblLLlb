import { FC } from 'react'
import { Toaster } from '@/shared/ui'
import { AppProps } from '../type'

export const withToaster = (component: FC) => (props: AppProps) => {
	return (
		<>
			{component(props)}
			<Toaster />
		</>
	)
}

export default withToaster
