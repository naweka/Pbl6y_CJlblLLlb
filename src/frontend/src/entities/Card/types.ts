import { STATUS_KEY } from '@/shared/config'

export interface Card {
	id: string
	title: string
	description: string
	tags: string[]
	status: STATUS_KEY
	files: any[]
}
