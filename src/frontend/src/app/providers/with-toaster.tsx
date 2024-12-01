import { FC } from 'react'
import { AppProps } from '../type'
import { Toaster } from '@/shared/ui'

export const withToaster = (component: FC) => (props: AppProps) => {
    return <>{component(props)}<Toaster /></>
}

export default withToaster
