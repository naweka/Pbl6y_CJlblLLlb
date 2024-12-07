import { makeAutoObservable, runInAction } from 'mobx';
import { getCard } from '@/entities/Card';
import { Card } from '@/entities/Card/types';
import { File, GetFileIdData, getFiles, getFileSpectrogram } from '@/entities/File';
import { getParams } from '@/shared/lib';
import { STATUS } from '@/shared/types';
import { IDetailPageStore } from './types';


class DetailPageStore implements IDetailPageStore {
	_card: Card | null = null
	_status: STATUS = STATUS.INITIAL
	_statusFiles: STATUS = STATUS.INITIAL
	_files: File[] | null = null

	reset() {
		this._card = null
		this._status = STATUS.INITIAL
		this._statusFiles = STATUS.INITIAL
		this._files = null
	}

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get status() {
		return this._status
	}

	get statusFiles() {
		return this._statusFiles
	}

	get card() {
		return this._card
	}

	get files() {
		return this._files
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

	async fetchFileSpec(data: GetFileIdData) {
		try {
			const res = await getFileSpectrogram(data)
			return res?.data
		} catch (error) {
			console.error(error)
		}
	}

	async fetchFilesCard() {
		this._statusFiles = STATUS.LOADING
		const id = this._card?.id
		if (!id) return
		try {
			const res = await getFiles({ id })
			runInAction(async () => {
				if (res?.data) {
					const files = res.data
					const fileWithBlob = []
					for (const file of files) {
						const blob = await this.fetchFileSpec({ id: file.id })
						fileWithBlob.push({ ...file, url: blob })
					}
					this._files = fileWithBlob
				}
				this._statusFiles = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._statusFiles = STATUS.ERROR
		}
	}
}

export default new DetailPageStore()