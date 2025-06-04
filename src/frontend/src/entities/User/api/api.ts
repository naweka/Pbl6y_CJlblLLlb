import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { routes } from './routes'
import { ApiGetCurrentUser } from './types'

export const getCurrentUser = async () => {
	return await http?.get<any, AxiosResponse<ApiGetCurrentUser>>(
		routes.getCurrentUser(),
	)
}
