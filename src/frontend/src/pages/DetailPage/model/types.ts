import { STATUS } from '@/shared/types'

export interface IDetailPageStore {
	status: STATUS
}

export interface FileUploadProgress {
	isCompleted: boolean
	controller: AbortController
}

export type FileUploadsProgress = Record<string, FileUploadProgress>
