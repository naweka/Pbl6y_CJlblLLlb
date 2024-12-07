import { makeAutoObservable, runInAction } from 'mobx'
import { getAllCard } from '@/entities/Card'
import { Card } from '@/entities/Card/types'
import { getTags } from '@/entities/Tags'
import { debounce } from '@/shared/lib'
import { queryParamsStore } from '@/shared/model/queryParamsStore'
import { STATUS } from '@/shared/types'
import { IIndexPageStore } from './types'

class IndexPageStore implements IIndexPageStore {
	_search: string = ''
	_activeTags: string[] = []
	_tags: string[] = []
	_cards: Card[] = []
	_statusCards: STATUS = STATUS.INITIAL
	_statusTags: STATUS = STATUS.INITIAL

	constructor() {
		this._search = queryParamsStore.getParam('search') || ''
		this._activeTags = queryParamsStore.getParam('tags', 'array') || []
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}
	get statusCards() {
		return this._statusCards
	}

	get statusTags() {
		return this._statusTags
	}

	get cards() {
		return this._cards
	}

	get search() {
		return this._search
	}

	get tags() {
		return this._tags
	}

	get tagsWithActive() {
		return this._tags.map((string) => ({
			title: string,
			active: this._activeTags.includes(string),
		}))
	}

	debounceSearch = debounce(() => {
		queryParamsStore.setParam('search', this._search)
		this.fetchAllCards()
	}, 250)

	setActiveTags(value: string) {
		if (this._activeTags.includes(value)) {
			this._activeTags = this._activeTags.filter((tag) => tag !== value)
		} else {
			this._activeTags = [...this._activeTags, value]
		}
		queryParamsStore.setParam('tags', this._activeTags)
		this.fetchAllCards()
	}

	setSearch(e: React.ChangeEvent<HTMLInputElement>) {
		this._search = e.target.value
		this.debounceSearch()
	}

	async fetchAllTags() {
		this._statusTags = STATUS.LOADING
		try {
			const res = await getTags()
			runInAction(() => {
				if (res?.data) {
					this._tags = res.data
				}
				this._statusTags = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._statusTags = STATUS.ERROR
		}
	}

	async fetchAllCards() {
		this._statusCards = STATUS.LOADING
		try {
			const res = await getAllCard({
				search_text: this._search,
				tags: this._activeTags,
			})
			runInAction(() => {
				if (res?.data) {
					this._cards = res.data
				}
				this._statusCards = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._statusCards = STATUS.ERROR
		}
	}
}

export default new IndexPageStore()
