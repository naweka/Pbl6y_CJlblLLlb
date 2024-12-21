export interface GetFilesCardData {
	id: string
}

export interface GetFileIdData {
	id: string
}

export interface PostUploadFileData {
	cardId: string
	fileId: string
	file: File
}
