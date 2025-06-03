import { GetFileIdData } from './types'

export const routes = {
	getFiles: () => '/getFilesByCard',
	getFile: ({ id }: GetFileIdData) => `/getFile/${id}`,
	getSpectrogram: ({ id }: GetFileIdData) => `/spectrogram/${id}`,
	getIdForNewFile: () => `/getIdForNewFile`,
	uploadFile: () => '/uploadFile',
	deleteFile: () => '/deleteFile',
}
