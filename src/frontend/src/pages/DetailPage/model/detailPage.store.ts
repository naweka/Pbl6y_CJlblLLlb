import { makeAutoObservable, runInAction } from 'mobx';
import { getCard } from '@/entities/Card';
import { Card } from '@/entities/Card/types';
import { getParams } from '@/shared/lib';
import { STATUS } from '@/shared/types';
import { IDetailPageStore } from './types';


class DetailPageStore implements IDetailPageStore {
	_card: Card | null = null
	_status: STATUS = STATUS.INITIAL

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get status() {
		return this._status
	}

	get card() {
		return this._card
	}

	async fetchDetailPage() {
		this._status = STATUS.LOADING
		const params = getParams<{ id: string }>()
		if (!params) return
		try {
			const res = await getCard(params)
			runInAction(() => {
				if (res?.data) {
					this._card = res.data
				}
				this._status = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._status = STATUS.ERROR
		}
	}
}

export default new DetailPageStore()