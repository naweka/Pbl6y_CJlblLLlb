import axios, { AxiosInstance, CreateAxiosDefaults } from 'axios';
import { middlewaresCommon } from './middleware';


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

	http.interceptors.response.use(
		(config) => {
			middlewaresCommon(config)
			const { result } = config.data
			config.data = result
			return config
		},
		(error) => {
			middlewaresCommon(error.response)
			return Promise.reject(error)
		},
	)
}