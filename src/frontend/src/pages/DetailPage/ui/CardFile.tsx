import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import { DeleteFile } from '@/entities/DeleteFile'
import { File } from '@/entities/File'
import { DownloadFile } from '@/features/Download'
import { isEmpty } from '@/shared/lib'
import { FishLoader, Progress } from '@/shared/ui'
import { detailPageStore } from '../model'
import { PanoramaImg } from './PanoramaImg'

interface CardFileProps {
	file: File
}

const ProgressIndicator = observer(({ id }: { id: string }) => {
	const upload = detailPageStore.getUpload(id)

	if (isEmpty(upload)) return null

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-background opacity-80">
			<div className="flex w-1/2 flex-col items-center justify-center">
				<FishLoader />
				<ProgressBar id={id} />
			</div>
		</div>
	)
})

const ProgressBar = observer(({ id }: { id: string }) => {
	const progress = detailPageStore.getUploadProgress(id)
	return (
		<div className="w-full">
			<Progress value={progress} />
			<div className="mt-1 text-center font-bold">
				<span>{progress}</span> / <span>100</span>
			</div>
		</div>
	)
})

const ProgressLoading = observer(({ id }: { id: string }) => {
	const isLoading = detailPageStore.getLoadingFile(id)

	if (!isLoading) return null

	return (
		<div className="absolute inset-0 flex items-center justify-center bg-background">
			<div className="flex w-1/2 flex-col items-center justify-center">
				<FishLoader />
				<div className="text-center font-bold">
					Пожалуйста, подождите, идет загрузка файла
				</div>
			</div>
		</div>
	)
})

const FilePreview = ({ file }: { file: File }) => (
	<div className="relative h-[150px] w-full overflow-x-auto rounded-md border">
		<ProgressIndicator id={file.id} />
		{file.url && <PanoramaImg src={URL.createObjectURL(file.url)} />}
		<ProgressLoading id={file.id} />
	</div>
)

const FileActions = observer(({ fileId }: { fileId: string }) => {
	const upload = detailPageStore.getUpload(fileId)
	return (
		<>
			<DownloadFile fileId={fileId} disabled={!isEmpty(upload)} />
			<DeleteFile onClick={() => detailPageStore.deleteFile(fileId)} />
		</>
	)
})

export const CardFile: FC<CardFileProps> = observer(({ file }) => {
	return (
		<div className="space-y-5">
			<div className="flex flex-row gap-4">
				<div
					className="flex w-full items-center overflow-hidden rounded-md border p-3 py-1"
					title={file.name}
				>
					<p className="overflow-hidden text-ellipsis whitespace-nowrap">
						{file.name}
					</p>
				</div>
				<FileActions fileId={file.id} />
			</div>
			<FilePreview file={file} />
		</div>
	)
})
