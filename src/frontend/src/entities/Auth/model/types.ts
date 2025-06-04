import { STATUS } from '@/shared/types'
import { SendLoginData, SignUpData } from '../api'

export interface IAuthStore {
	isAuth: boolean
	status: STATUS

	login: (data: SendLoginData) => Promise<void>
	checkAuth: () => Promise<void>
	signUp: (data: SignUpData) => Promise<void>
	logout: () => Promise<void>
}
