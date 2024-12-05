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
