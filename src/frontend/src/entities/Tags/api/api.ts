import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { routes } from './routes'
import { ApiGetTags } from './types'

export const getTags = async () => {
	return await http?.get<any, AxiosResponse<ApiGetTags>>(routes.tags())
}
