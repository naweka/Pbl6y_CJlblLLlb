import { makeAutoObservable } from 'mobx'
import { PostUploadFileData, sendUploadFile } from '@/entities/File'
import {
	getGenerateGuides,
	GetGenerateGuidesData,
} from '@/entities/GenerateGuid'
import { IUploadFilesCard } from './types'
import { AxiosProgressEvent } from 'axios'

class UploadFilesCard implements IUploadFilesCard {
	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	async uploadFile(data: PostUploadFileData, { onProgress, controller }: { onProgress?: (progressEvent: AxiosProgressEvent) => void; controller?: AbortController }) {
		try {
			const file = sendUploadFile(data, { onProgress, controller })
			return file
		} catch (error) {
			console.error(error)
		}
	}

	async getGuides(data: GetGenerateGuidesData) {
		return await getGenerateGuides(data)
	}
}

export default new UploadFilesCard()
