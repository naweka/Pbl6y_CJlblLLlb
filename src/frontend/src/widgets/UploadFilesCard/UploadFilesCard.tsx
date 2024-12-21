import { CloudUpload, Paperclip } from 'lucide-react'
import { FC, useState } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import {
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
} from '@/shared/ui'

interface UploadFilesCardProps {}

const FileSvgDraw = () => {
	return (
		<>
			<CloudUpload className="h-8 w-8" />
			<p className="mb-1 text-center text-sm text-foreground">
				<span className="font-semibold">Нажмите, чтобы загрузить</span>
				&nbsp;или перетащите и отпустите
			</p>
			<p className="text-xs text-foreground">WAV</p>
		</>
	)
}

export const UploadFilesCard: FC<UploadFilesCardProps> = () => {
	const [files, setFiles] = useState<File[] | null>(null)

	const dropZoneConfig: DropzoneOptions = {
		maxFiles: 5,
		maxSize: 1024 * 1024 * 500,
		multiple: true,
		accept: {
			wav: ['.wav'],
		},
	}

	return (
		<FileUploader
			value={files}
			onValueChange={setFiles}
			dropzoneOptions={dropZoneConfig}
			className="relative rounded-md bg-background p-1"
		>
			<FileInput className="rounded-md outline-dashed outline-2 outline-border">
				<div className="flex w-full flex-col items-center justify-center px-5 pb-4 pt-3">
					<FileSvgDraw />
				</div>
			</FileInput>
			<FileUploaderContent>
				{files &&
					files.length > 0 &&
					files.map((file, i) => (
						<FileUploaderItem key={i} index={i}>
							<Paperclip className="h-4 w-4 stroke-current" />
							<span>{file.name}</span>
						</FileUploaderItem>
					))}
			</FileUploaderContent>
		</FileUploader>
	)
}
