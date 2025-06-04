import { FileDown } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import {
	Button,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'
import { routerDownload } from '../api'
import { fileDownloadByUrl } from '../utils'

interface DownloadFileProps {
	fileId: string
	disabled?: boolean
}

export const DownloadFile: FC<DownloadFileProps> = observer(
	({ fileId, disabled }) => {
		const onDownloadFile = () => {
			fileDownloadByUrl(routerDownload.router.predictedData() + '/' + fileId)
		}

		return (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild disabled={disabled}>
						<Button
							variant="default"
							className="min-w-10"
							onClick={onDownloadFile}
							disabled={disabled}
							size="icon"
						>
							<FileDown />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p>Скачать файл.</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	},
)
