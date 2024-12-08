const API_URL = import.meta.env.VITE_API_URL

export const config = {
	baseApiUrl: API_URL,
	apiUrlV1: API_URL + '/api/v1',
	tokenKeyLS: 'token',
}
