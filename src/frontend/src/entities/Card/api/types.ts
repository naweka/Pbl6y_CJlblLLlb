import { ModelSetting } from '../types'

export interface SendCreateCardData {
	title: string
	description: string
	tags: string[]
}

export interface GetAllCardData {
	search_text?: string
	tags?: string[]
}

export interface GetCardData {
	id: string
}

export interface GetFilesCardData extends GetCardData {}

export interface SendUpdateCardData
	extends GetCardData,
		Partial<SendCreateCardData> {}

export interface SendUpdateModelSettingsFile extends ModelSetting {
	file_id: string
}
