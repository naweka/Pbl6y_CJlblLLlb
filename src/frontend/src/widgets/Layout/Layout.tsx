import { FC } from 'react'
import { Outlet } from 'react-router-dom'
import { Footer } from '../Footer'
import { Header } from '../Header'

interface LayoutProps {}

export const Layout: FC<LayoutProps> = () => {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<Outlet />
			<Footer />
		</div>
	)
}
