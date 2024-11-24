import { STATUS } from '@/shared/types'
import { User } from '../types'

export interface IUserStore {
	currentUser: User | null
	status: STATUS
}
