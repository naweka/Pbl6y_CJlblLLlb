import { makeAutoObservable, runInAction } from 'mobx'
import { STATUS } from '@/shared/types'
import { getTags } from '../api'
import { ITagsStore } from './types'

export class TagsStore implements ITagsStore {
	private _status = STATUS.INITIAL
	private _tags: string[] = []

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get status() {
		return this._status
	}

	get tags() {
		return this._tags
	}

	async fetchTags() {
		this._status = STATUS.LOADING
		try {
			const res = await getTags()
			runInAction(() => {
				if (res?.data) {
					this._tags = res.data
				}
				this._status = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._status = STATUS.ERROR
		}
	}
}

export default new TagsStore()
