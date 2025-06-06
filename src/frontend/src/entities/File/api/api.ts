import type { AxiosProgressEvent, AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { config } from '@/shared/config'
import { File } from '../types'
import { routes } from './routes'
import {
	GetFileIdData,
	GetFilesCardData,
	PostDeleteFileData,
	PostUploadFileData,
} from './types'

export const getFiles = async (data: GetFilesCardData) => {
	return await http?.post<any, AxiosResponse<File[]>>(routes.getFiles(), data)
}

export const getFile = async (data: GetFileIdData) => {
	return await http?.get<any, AxiosResponse<File>>(routes.getFile(data))
}

export const getFileSpectrogram = async (data: GetFileIdData) => {
	return await http?.get<any, AxiosResponse<Blob>>(
		routes.getSpectrogram(data),
		{ responseType: 'blob', baseURL: config.baseApiUrl },
	)
}

export const getIdForNewFile = async () => {
	return await http?.get<any, AxiosResponse<string>>(routes.getIdForNewFile())
}

export const sendUploadFile = async (
	data: PostUploadFileData,
	{
		onProgress,
		controller,
	}: {
		onProgress?: (progressEvent: AxiosProgressEvent) => void
		controller?: AbortController
	},
) => {
	return await http?.post<any, AxiosResponse<string>>(
		routes.uploadFile(),
		data,
		{
			onUploadProgress: onProgress,
			headers: { 'Content-Type': 'multipart/form-data' },
			signal: controller?.signal,
		},
	)
}

export const deleteFile = async (data: PostDeleteFileData) => {
	return await http?.post<any, AxiosResponse<string>>(routes.deleteFile(), data)
}
