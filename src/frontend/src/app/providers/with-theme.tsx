import { FC } from 'react'
import { ThemeProvider } from '@/shared/lib'
import { AppProps } from '../type'

export const withTheme = (component: FC) => (props: AppProps) => {
	return <ThemeProvider>{component(props)}</ThemeProvider>
}

export default withTheme
