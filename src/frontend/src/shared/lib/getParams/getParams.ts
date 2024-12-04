import { matchPath } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '@/shared/config'

const omitRoutes = ['*']

export const getParams = <T>() => {
	for (const route of Object.values(ROUTE_CONSTANTS).filter(
		(item) => !omitRoutes.includes(item.URL),
	)) {
		const match = matchPath(route.URL, window.location.pathname)
		if (match) return match.params as T
	}
	return null
}
