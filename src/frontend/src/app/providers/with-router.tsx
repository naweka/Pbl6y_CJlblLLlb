import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ProtectedAuth, RedirectToMain } from '@/entities/Auth/ui'
import { Loading } from '@/entities/Loading'
import { AuthPage } from '@/pages/AuthPage'
import { DetailPage } from '@/pages/DetailPage'
import { IndexPage } from '@/pages/IndexPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { UserPage } from '@/pages/UserPage'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Layout } from '@/widgets/Layout'

const publicRouter = [
	{
		children: [
			{
				path: ROUTE_CONSTANTS.NOTFOUND.URL,
				element: <NotFoundPage />,
			},
		],
	},
]

const authRouter = [
	{
		element: <RedirectToMain />,
		children: [
			{
				path: ROUTE_CONSTANTS.AUTH.URL,
				lazy: AuthPage,
			},
		],
	},
]

const protectedRouter = [
	{
		element: <ProtectedAuth />,
		children: [
			{
				path: ROUTE_CONSTANTS.INDEX.URL,
				index: true,
				lazy: IndexPage,
			},
			{
				path: ROUTE_CONSTANTS.USER_PAGE.URL,
				lazy: UserPage,
			},
			{
				path: ROUTE_CONSTANTS.DETAIL_CARD.URL,
				lazy: DetailPage,
			},
		],
	},
]

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [...publicRouter, ...authRouter, ...protectedRouter],
	},
])

/**
 * @hoc Инициализация роутера
 */
const withRouter = () => () => {
	return <RouterProvider router={router} fallbackElement={<Loading />} />
}

export default withRouter
