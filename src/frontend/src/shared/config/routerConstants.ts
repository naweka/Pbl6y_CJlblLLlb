export const ROUTE_CONSTANTS = {
	INDEX: {
		URL: '/',
		TO: () => '/',
	},
	AUTH: {
		URL: '/auth',
		TO: () => '/auth',
	},
	USER_PAGE: {
		URL: '/profile',
		TO: () => '/profile',
	},
	DETAIL_CARD: {
		URL: '/detail/:id',
		TO: (id: string | number) => `/detail/${id}`,
	},
	NOTFOUND: {
		URL: '*',
		TO: () => `*`,
	},
}
