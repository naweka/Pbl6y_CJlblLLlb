import { makeAutoObservable, runInAction } from 'mobx'
import { STATUS } from '@/shared/types'
import { getAllCard, GetAllCardData } from '../api'
import { Card } from '../types'
import { ITagsStore } from './types'

export class CardsStore implements ITagsStore {
	private _status = STATUS.INITIAL
	private _cards: Card[] = []

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get status() {
		return this._status
	}

	get cards() {
		return this._cards
	}

	async fetchAllCards(data: GetAllCardData) {
		this._status = STATUS.LOADING
		try {
			const res = await getAllCard(data)
			runInAction(() => {
				if (res?.data) {
					this._cards = res.data
				}
				this._status = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._status = STATUS.ERROR
		}
	}

	// async deleteCards(id) {

	// }
}

export default new CardsStore()
