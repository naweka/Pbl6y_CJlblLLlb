export interface SendCreateCardData {
	title: string
	description: string
	tags: string[]
}

export interface ApiPostCreateCard {
	id: string
	title: string
	description: string
	tags: string[]
	status: string
	files: any[]
}