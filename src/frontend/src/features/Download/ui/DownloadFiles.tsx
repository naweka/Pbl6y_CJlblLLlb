import { Download } from 'lucide-react'
import { FC } from 'react'
import { Button } from '@/shared/ui'

interface DownloadFilesProps {}

export const DownloadFiles: FC<DownloadFilesProps> = () => {
	return (
		<Button>
			Скачать доступную разметку
			<Download />
		</Button>
	)
}
