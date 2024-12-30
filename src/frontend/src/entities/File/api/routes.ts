import { GetFileIdData } from './types'

export const routes = {
	getFiles: () => '/getFilesByCard',
	getSpectrogram: ({ id }: GetFileIdData) => `/spectrogram/${id}`,
	getIdForNewFile: () => `/getIdForNewFile`,
	uploadFile: () => '/uploadFile',
	deleteFile: () => '/deleteFile',
}
