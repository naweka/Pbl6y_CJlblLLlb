import { Card } from '@/entities/Card/types'
import { STATUS } from '@/shared/types'

export interface IIndexPageStore {
	statusCards: STATUS
	statusTags: STATUS
	cards: Card[]
	tags: string[]
	search: string
}
