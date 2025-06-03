import { makeAutoObservable, runInAction } from 'mobx'
import {
	getCard,
	getModelSettigsFile,
	sendUpdateCard,
	SendUpdateCardData,
	sendUpdateModelSettingsFile,
} from '@/entities/Card'
import { Card, ModelSetting } from '@/entities/Card/types'
import {
	deleteFile,
	File as FileCard,
	getFile,
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
	_settingFileToggle: Record<string, boolean> = {}
	_settingFiles: Record<string, ModelSetting> = {}
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
		this.loadingFile = {}
		this.currentUploads = {}
		this.currentUploadsProgress = {}
		this.currentError = {}
		this._settingFileToggle = {}
		this._settingFiles = {}
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

	setFileById(file: FileCard) {
		if (!this._files) return
		const index = this._files.findIndex(({ id }) => id === file.id)
		if (index !== -1) {
			this._files[index] = file
		}
	}

	mutateCard(card: Partial<Card>) {
		runInAction(() => {
			if (this._card) {
				this._card = { ...this._card, ...card }
			}
		})
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

	async fetchFileSpec(data: GetFileIdData & { isSeamless?: boolean }) {
		const isSeamless = data.isSeamless || false
		if (!isSeamless) this.setLoadingFile(data.id, true)
		try {
			const res = await getFileSpectrogram(data)
			if (!isSeamless) this.setLoadingFile(data.id, false)
			return res?.data
		} catch (error) {
			console.error(error)
		}
	}

	async fetchFileSetting(fileId: string) {
		try {
			const res = await getModelSettigsFile(fileId)
			this.setSettingFile(fileId, res?.data!)
		} catch (error) {
			console.error(error)
		}
	}

	async watchFile(id: string) {
		while (true) {
			try {
				const res = await getFile({ id })
				const data = res?.data
				if (data) {
					this.setFileById(data)
					if (data.file_status === 'READY' || data.file_status === 'DONE') {
						return data
					}
				}
			} catch (error) {
				console.error(`Error fetching file with id: ${id}`, error)
			}
			await new Promise((resolve) => setTimeout(resolve, 5000))
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
					await Promise.all(
						files.map(async (file) => {
							this.setLoadingFile(file.id, true)
							while (true) {
								try {
									if (this.checkWantToWatchFile(file)) {
										file = await this.watchFile(file.id)
									}
									const blob = await this.fetchFileSpec({
										id: file.id,
										isSeamless: true,
									})
									this.setLoadingFile(file.id, false)
									if (blob) {
										this.setFileById({ ...file, url: blob })
										this.fetchFileSetting(file.id)
										return
									}
								} catch (error) {
									console.error(`Retrying for file id: ${file.id}`, error)
								}
							}
						}),
					)
					this.mutateCard({ status: 'READY' })
				}
			})
		} catch (error) {
			console.error(error)
		}
	}

	isPreparingFile(fileId: string) {
		const file = this._files?.find(
			(file) => file.id === fileId && this.checkWantToWatchFile(file),
		)
		return Boolean(file)
	}

	checkWantToWatchFiles(files: FileCard[]) {
		const ids = files.filter((file) => {
			return this.checkWantToWatchFile(file)
		})

		return ids
	}

	checkWantToWatchFile(file: FileCard) {
		return file.file_status === 'PREPARING' || file.file_status === 'ANALYZING'
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
							await this.fetchFileSetting(file.id)
							return { ...file, url: blob }
						}),
					)
					this._files = fileWithBlob
				}
				this._statusFiles = STATUS.SUCCESS

				if (this._files) {
					const files = this.checkWantToWatchFiles(this._files)
					await Promise.all(
						files.map(async (file) => {
							this.setLoadingFile(file.id, true)
							file = await this.watchFile(file.id)

							const blob = await this.fetchFileSpec({
								id: file.id,
								isSeamless: true,
							})

							if (blob) {
								this.setFileById({ ...file, url: blob })
								this.fetchFileSetting(file.id)
								this.setLoadingFile(file.id, false)
								return
							}
						}),
					)
					this.mutateCard({ status: 'READY' })
				}
			})
		} catch (error) {
			console.error(error)
			this._statusFiles = STATUS.ERROR
		}
	}

	getToggleSetting(id: string) {
		return this._settingFileToggle[id]
	}

	getSetting(id: string) {
		return this._settingFiles[id]
	}

	setToggleSettings(id: string, value: boolean) {
		this._settingFileToggle[id] = value
	}

	setSettingFile(id: string, data: ModelSetting) {
		this._settingFiles[id] = data
	}

	setEdit(value: boolean) {
		this.edit = value
	}

	convertFileToCardFile(ids: string[]) {
		return (file: File, index: number): FileCard => {
			return {
				alias_name: file.name,
				id: ids[index],
				name: file.name,
				file_status: 'PREPARING',
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

	async updateFileSetting(fileId: string, data: ModelSetting) {
		try {
			await sendUpdateModelSettingsFile({
				file_id: fileId,
				...data,
			})
			this.setSettingFile(fileId, data)

			this.setLoadingFile(fileId, true)
			const file = await this.watchFile(fileId)

			const blob = await this.fetchFileSpec({
				id: file.id,
				isSeamless: true,
			})

			if (blob) {
				this.setFileById({ ...file, url: blob })
				this.setLoadingFile(file.id, false)
			}
		} catch (error) {
			console.error(error)
		}
	}

	async uploadFiles(cardId: string, data: UploadFiles) {
		try {
			this.mutateCard({ status: 'ANALYZING' })

			const response = await uploadFilesCardStore.getGuides({
				count: data.files.length,
			})

			if (!response || !response.data) {
				throw new Error('Failed to get ids')
			}

			const ids: string[] = response?.data || []

			const localFile = data.files.map(this.convertFileToCardFile(ids))
			runInAction(() => {
				this._files = this._files?.concat(localFile) || localFile
			})

			const uploadPromises = data.files.map((file, index) => {
				const fileData = { file, cardId, fileId: ids[index] }
				const controller = new AbortController()
				const id = localFile[index].id

				this.setUpload(id, {
					isCompleted: false,
					controller,
				})

				return uploadFilesCardStore
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
					.finally(() => {
						delete this.currentUploads[id]
						delete this.currentUploadsProgress[id]
					})
					.then(() => {
						return id
					})
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

	onChange<T extends keyof Card>(name: T, value: Card[T]) {
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
