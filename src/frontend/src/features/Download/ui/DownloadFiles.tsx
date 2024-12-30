import { Download } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/shared/ui'
import { fileDownloadByUrl } from '../utils'
import { routerDownload } from '../api'

interface DownloadFilesProps {
	cardId: string
}

export const DownloadFiles: FC<DownloadFilesProps> = ({ cardId }) => {
	const onDownloadAllFile = () => {
		fileDownloadByUrl(routerDownload.router.allPredictedDataForCard() + '/' + cardId)
	}

	return (
		<Button onClick={onDownloadAllFile}>
			Скачать доступную разметку
			<Download />
		</Button>
	)
}
