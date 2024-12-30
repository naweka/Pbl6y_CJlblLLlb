import { makeAutoObservable, runInAction } from 'mobx'
import { getCard, sendUpdateCard, SendUpdateCardData } from '@/entities/Card'
import { Card } from '@/entities/Card/types'
import {
	deleteFile,
	File,
	GetFileIdData,
	getFiles,
	getFileSpectrogram,
} from '@/entities/File'
import { getParams } from '@/shared/lib'
import { STATUS } from '@/shared/types'
import { UploadFiles, uploadFilesCardStore } from '@/widgets/UploadFilesCard'
import { IDetailPageStore } from './types'

class DetailPageStore implements IDetailPageStore {
	_card: Card | null = null
	_status: STATUS = STATUS.INITIAL
	_statusFiles: STATUS = STATUS.INITIAL
	_files: File[] | null = null
	edit = false

	reset() {
		this._card = null
		this._status = STATUS.INITIAL
		this._statusFiles = STATUS.INITIAL
		this._files = null
		this.edit = false
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
					const fileWithBlob = await Promise.all(
						files.map(async (file) => {
							const blob = await this.fetchFileSpec({ id: file.id })
							return { ...file, url: blob }
						}),
					)
					this._files = fileWithBlob
				}
				this._statusFiles = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._statusFiles = STATUS.ERROR
		}
	}

	setEdit(value: boolean) {
		this.edit = value
	}

	async uploadFiles(cardId: string, data: UploadFiles) {
		try {
			const response = await uploadFilesCardStore.getGuides({
				count: data.files.length,
			})
			if (!response || !response.data) {
				console.error('Failed to get response data')
			}
			const ids: string[] = response?.data || []
			const uploadPromises = data.files.map((file, index) => {
				const fileData = { file, cardId, fileId: ids[index] }
				return uploadFilesCardStore.uploadFile(fileData)
			})
			await Promise.allSettled(uploadPromises)
		} catch (error) {
			console.error(error)
		}
	}

	async updateCard(data: SendUpdateCardData) {
		try {
			await sendUpdateCard(data)
		} catch (error) {
			console.error(error)
		}
	}

	async onSaveEditable(name: keyof Card) {
		if (!this._card) return
		const data = { id: this._card.id, [name]: this._card[name] }
		await this.updateCard(data)
	}

	onChange(name: keyof Card, value: any) {
		if (this._card) {
			this._card[name] = value
		}
		this.onSaveEditable(name)
	}

	async deleteFile(idFile: string) {
		this.filterDeleteFile(idFile)
		await this.fetchDeleteFile(idFile)
	}

	filterDeleteFile(idFile: string) {
		this._files = this._files
			? this._files.filter(({ id }) => id !== idFile)
			: null
	}

	async fetchDeleteFile(idFile: string) {
		try {
			await deleteFile({ id: idFile })
		} catch (error) {
			console.error(error)
		}
	}
}

export default new DetailPageStore()
