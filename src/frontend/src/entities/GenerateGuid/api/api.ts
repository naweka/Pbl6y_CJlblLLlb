import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { routes } from './routes'
import { GetGenerateGuidesData } from './types'

export const getGenerateGuid = async () => {
	return await http?.get<any, AxiosResponse<string>>(routes.generateGuid())
}

export const getGenerateGuides = async (data: GetGenerateGuidesData) => {
	return await http?.post<any, AxiosResponse<string[]>>(
		routes.generateGuides(),
		data,
	)
}
