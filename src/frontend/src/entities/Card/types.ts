import { STATUS_KEY } from '@/shared/config'

export interface Card {
	id: string
	title: string
	description: string
	tags: string[]
	status: STATUS_KEY
	files: any[]
}

export interface ModelSetting {
	confidence_limit: number
	ignore_noise_outliers: string
	ignore_sound_outliers: string
	min_sound_length: number
	offset_bounds: number
	window_size: number
	window_step: number
}
