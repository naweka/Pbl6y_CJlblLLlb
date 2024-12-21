import { http } from '@/shared/api'
import { config } from '@/shared/config'

export const extractFileName = (str: string) => {
	const reg =
		/.*filename\*="?utf-8'.*'(?<filenameRFC5987>.*?)"?(;.*)?$|.*filename="?(?<filename>.*?)"?(;.*)?$/

	const finded = str.match(reg)
	return finded?.groups?.filenameRFC5987
		? decodeURIComponent(finded.groups.filenameRFC5987)
		: (finded?.groups?.filename ?? undefined)
}

export const fileDownloadByUrl = async (url: string) => {
	const requestConfig = {
		url,
		baseURL: config.baseApiUrl,
		method: 'get',
		headers: { 'Cache-Control': 'no-cache' },
		responseType: 'blob' as const,
	}

	const response = await http?.(requestConfig)
	const link = document.createElement('a')
	link.href = URL.createObjectURL(new Blob([response?.data]))
	const contentDisposition = response?.headers['content-disposition']
	let fileName = 'Без имени'
	if (contentDisposition) {
		fileName = extractFileName(contentDisposition) || ''
	}
	if (!fileName) {
		const match = url.match(/([^/]+)$/)
		fileName = match ? match[1] : ''
	}

	link.setAttribute('download', fileName)
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
