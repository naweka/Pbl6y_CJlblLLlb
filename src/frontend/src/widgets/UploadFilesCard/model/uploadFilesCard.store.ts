import { makeAutoObservable } from 'mobx'
import { PostUploadFileData, sendUploadFile } from '@/entities/File'
import { IUploadFilesCard } from './types'

class UploadFilesCard implements IUploadFilesCard {
	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	async uploadFile(data: PostUploadFileData) {
		try {
			const file = sendUploadFile(data)
			return file
		} catch (error) {
			console.error()
		}
	}

	// async uploadFiles(data) {
	// 	try {
	// 	} catch (error) {}
	// }
}

export default new UploadFilesCard()
