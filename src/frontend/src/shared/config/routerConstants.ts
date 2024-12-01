export const ROUTE_CONSTANTS = {
	INDEX: '/',
	AUTH: '/auth',
	NOTFOUND: '*',
	USER_PAGE: '/profile',
	DETAIL_CARD: {
		URL: '/detail/:id',
		TO: (id: string | number) => `/detail/${id}`,
	},
}
