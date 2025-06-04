import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { routes } from './routes'
import { ApiPostLogin, ApiPostSignUp, SendLoginData, SignUpData } from './types'

export const sendLogin = async (data: SendLoginData) => {
	return await http?.post<any, AxiosResponse<ApiPostLogin>>(
		routes.login(),
		data,
	)
}

export const sendSignUp = async (data: SignUpData) => {
	return await http?.post<any, AxiosResponse<ApiPostSignUp>>(
		routes.signup(),
		data,
	)
}
