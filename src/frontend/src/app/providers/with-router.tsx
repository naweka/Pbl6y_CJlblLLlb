import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { IndexPage } from '@/pages/IndexPage'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Layout } from '@/widgets/Layout'
import { AuthPage } from '@/pages/AuthPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedAuth, RedirectToMain } from '@/entities/Auth/ui'
import { Loading } from '@/entities/Loading'
import { UserPage } from '@/pages/UserPage'

const publicRouter = [{
	children: [
		{
			path: ROUTE_CONSTANTS.INDEX,
			index: true,
			lazy: IndexPage,
		},
		{
			path: ROUTE_CONSTANTS.NOTFOUND,
			element: <NotFoundPage />,
		},
	],
}]

const authRouter = [{
	element: <RedirectToMain />,
	children: [
		{
			path: ROUTE_CONSTANTS.AUTH,
			lazy: AuthPage,
		},
	],
}]

const protectedRouter = [{
	element: <ProtectedAuth />,
	children: [
		{
			path: ROUTE_CONSTANTS.USER_PAGE,
			lazy: UserPage,
		},
	],
}]

export const router = createBrowserRouter([{
	element: <Layout />,
	children: [
		...publicRouter, ...authRouter, ...protectedRouter
	]
}])

/**
 * @hoc Инициализация роутера
 */
const withRouter = () => () => {
	return <RouterProvider router={router} fallbackElement={<Loading />} />
}

export default withRouter