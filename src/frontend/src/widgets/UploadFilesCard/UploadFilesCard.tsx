import { Upload } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { BaseForm } from '@/entities/Form'
import { Button, Form } from '@/shared/ui'
import { UploadFiles } from './model'

interface UploadFilesCardProps {
	onUploadFiles?: (payload: UploadFiles) => void
}

const KEY_FIELD = 'files'

export const UploadFilesCard: FC<UploadFilesCardProps> = observer(
	({ onUploadFiles }) => {
		const form = useForm<UploadFiles>()

		const dropZoneConfig: DropzoneOptions = {
			maxFiles: 5,
			maxSize: 1024 * 1024 * 500,
			multiple: true,
			accept: {
				'audio/wav': ['.wav'],
			},
		}

		const onSubmit = async (payload: UploadFiles) => {
			onUploadFiles?.(payload)
			form.reset({})
		}

		const isHaveFiles = form.watch(KEY_FIELD)

		return (
			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<BaseForm.BaseFieldUpload
						name={KEY_FIELD}
						dropzoneOptions={dropZoneConfig}
					/>
					{isHaveFiles && isHaveFiles?.length > 0 && (
						<Button
							type="submit"
							className="w-full"
							loading={form.formState.isSubmitting}
						>
							<Upload /> Загрузить
						</Button>
					)}
				</form>
			</Form>
		)
	},
)
