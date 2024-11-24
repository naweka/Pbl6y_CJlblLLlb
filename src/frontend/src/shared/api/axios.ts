import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios'

export let http: AxiosInstance | null = null

export interface ConfigAxiosCreate
	extends Pick<CreateAxiosDefaults, 'baseURL'> {
	tokenKeyLS: string
}

export const createAxios = (options: ConfigAxiosCreate) => {
	const { baseURL, tokenKeyLS } = options

	http = axios.create({
		baseURL,
		withCredentials: true,
		headers: {
			Accept: '*/*',
		},
	})

	http.interceptors.request.use((config) => {
		const token = localStorage.getItem(tokenKeyLS)

		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}

		return config
	})
}
