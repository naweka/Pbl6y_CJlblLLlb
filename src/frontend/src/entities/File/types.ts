import { STATUS_KEY } from '@/shared/config'

export interface File {
	id: string
	name: string
	file_status: STATUS_KEY
	url?: Blob
}
