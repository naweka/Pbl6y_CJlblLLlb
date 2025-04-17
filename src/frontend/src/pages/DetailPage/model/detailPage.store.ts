import { makeAutoObservable, runInAction } from 'mobx'
import { getCard, sendUpdateCard, SendUpdateCardData } from '@/entities/Card'
import { Card } from '@/entities/Card/types'
import {
	deleteFile,
	File as FileCard,
	GetFileIdData,
	getFiles,
	getFileSpectrogram,
} from '@/entities/File'
import { getParams } from '@/shared/lib'
import { STATUS } from '@/shared/types'
import { UploadFiles, uploadFilesCardStore } from '@/widgets/UploadFilesCard'
import {
	FileUploadProgress,
	FileUploadsProgress,
	IDetailPageStore,
} from './types'

class DetailPageStore implements IDetailPageStore {
	_card: Card | null = null
	_status: STATUS = STATUS.INITIAL
	_statusFiles: STATUS = STATUS.INITIAL
	_files: FileCard[] | null = null
	loadingFile: Record<string, boolean> = {}
	currentUploads: FileUploadsProgress = {}
	currentUploadsProgress: Record<string, number> = {}
	currentError: FileUploadsProgress = {}
	edit = false

	reset() {
		this._card = null
		this._status = STATUS.INITIAL
		this._statusFiles = STATUS.INITIAL
		this._files = null
		this.edit = false
	}

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true })
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
		this.setLoadingFile(data.id, true)
		try {
			const res = await getFileSpectrogram(data)
			this.setLoadingFile(data.id, false)
			return res?.data
		} catch (error) {
			console.error(error)
		}
	}

	async fetchSeamlessFilesCard(ids: string[]) {
		const id = this._card?.id

		if (!id) return

		try {
			const res = await getFiles({ id })
			runInAction(async () => {
				if (res?.data) {
					const files = res.data.filter((value) => ids.includes(value.id))
					const fileWithBlob = await Promise.all(
						files.map(async (file) => {
							while (true) {
								try {
									const blob = await this.fetchFileSpec({ id: file.id })
									if (blob) return { ...file, url: blob }
								} catch (error) {
									console.error(`Retrying for file id: ${file.id}`, error)
								}
								await new Promise((resolve) => setTimeout(resolve, 5000))
							}
						}),
					)
					this._files = fileWithBlob
				}
			})
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

	convertFileToCardFile(ids: string[]) {
		return (file: File, index: number) => {
			return {
				alias_name: file.name,
				id: ids[index],
				name: file.name,
			}
		}
	}

	setUpload(id: string, data: FileUploadProgress) {
		this.currentUploads[id] = data
	}

	setUploadProgress(id: string, progress: number) {
		this.currentUploadsProgress[id] = progress
	}

	setLoadingFile(id: string, value: boolean) {
		this.loadingFile[id] = value
	}

	getLoadingFile(id: string) {
		return this.loadingFile[id] || false
	}

	getUpload(id: string) {
		const upload = this.currentUploads[id] || {}
		return upload
	}

	getUploadProgress(id: string) {
		const progress = this.currentUploadsProgress[id]
		return progress || 0
	}

	async uploadFiles(cardId: string, data: UploadFiles) {
		try {
			const response = await uploadFilesCardStore.getGuides({
				count: data.files.length,
			})

			if (!response || !response.data) {
				throw new Error('Failed to get ids')
			}

			const ids: string[] = response?.data || []

			const localFile = data.files.map(this.convertFileToCardFile(ids))
			runInAction(() => {
				this._files = localFile
			})

			const uploadPromises = data.files.map((file, index) => {
				const fileData = { file, cardId, fileId: ids[index] }
				const controller = new AbortController()
				const id = localFile[index].id

				this.setUpload(id, {
					isCompleted: false,
					controller,
				})

				return (
					uploadFilesCardStore
						.uploadFile(fileData, {
							onProgress: (progressEvent) => {
								const progress = Math.round(
									(progressEvent.loaded * 100) / progressEvent.total!,
								)

								runInAction(() => {
									this.setUploadProgress(id, progress)
								})
							},
							controller,
						})
						// .catch(() => {
						// })
						.finally(() => {
							delete this.currentUploads[id]
							delete this.currentUploadsProgress[id]
						})
						.then(() => {
							return id
						})
				)
			})

			const res = await Promise.allSettled(uploadPromises)

			const idsCompleted = res
				.filter(Boolean)
				.filter((item) => item.status === 'fulfilled')
				.map(({ value }) => value)

			this.fetchSeamlessFilesCard(idsCompleted)
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
		this.abortUpload(idFile)
		await this.fetchDeleteFile(idFile)
	}

	abortUpload(id: string) {
		const controller = this.currentUploads[id]?.controller
		if (controller) {
			controller.abort()
		}
	}

	async fetchDeleteFile(idFile: string) {
		try {
			await deleteFile({ id: idFile })
			runInAction(() => {
				this.filterDeleteFile(idFile)
			})
		} catch (error) {
			console.error(error)
		}
	}

	filterDeleteFile(idFile: string) {
		this._files = this._files
			? this._files.filter(({ id }) => id !== idFile)
			: null
	}
}

export default new DetailPageStore()
