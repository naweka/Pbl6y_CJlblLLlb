import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { config } from '@/shared/config'
import { File } from '../types'
import { routes } from './routes'
import { GetFileIdData, GetFilesCardData, PostUploadFileData } from './types'

export const getFiles = async (data: GetFilesCardData) => {
	return await http?.post<any, AxiosResponse<File[]>>(routes.getFiles(), data)
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
export const sendUploadFile = async (data: PostUploadFileData) => {
	return await http?.post<any, AxiosResponse<string>>(
		routes.getIdForNewFile(),
		data,
		{
			headers: { 'Content-Type': 'multipart/form-data' },
		},
	)
}
