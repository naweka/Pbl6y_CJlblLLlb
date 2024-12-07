import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { File } from '../types'
import { routes } from './routes'
import { GetFileIdData, GetFilesCardData } from './types'

export const getFiles = async (data: GetFilesCardData) => {
	return await http?.post<any, AxiosResponse<File[]>>(routes.getFiles(), data)
}

export const getFileSpectrogram = async (data: GetFileIdData) => {
	return await http?.post<any, AxiosResponse<Blob>>(
		routes.getSpectrogram(),
		data,
		{ responseType: 'blob' }
	)
}
