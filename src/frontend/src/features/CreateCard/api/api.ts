import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { routes } from './routes'
import { ApiPostCreateCard, SendCreateCardData } from './types'

export const sendCreateCard = async (data: SendCreateCardData) => {
	return await http?.post<any, AxiosResponse<ApiPostCreateCard>>(
		routes.create(),
		data,
	)
}
