import { CloudUpload, Paperclip } from 'lucide-react'
import { FC } from 'react'
import { DropzoneOptions } from 'react-dropzone'
import { UseControllerProps } from 'react-hook-form'
import { cn } from '@/shared/lib'
import { AssignComponent } from '@/shared/types'
import {
	BaseFieldProps,
	FileInput,
	FileUploader,
	FileUploaderContent,
	FileUploaderItem,
	FileUploaderProps,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
} from '@/shared/ui'
import { InputProps } from '@/shared/ui/Input'
import { LabelProps } from '@radix-ui/react-label'

interface BaseFieldUploadProps
	extends Omit<InputProps, 'defaultValue' | 'name' | 'type' | 'value'>,
		BaseFieldProps,
		FileUploaderProps,
		UseControllerProps {
	labelProps?: LabelProps
	defaultValue?: string
}

const FileSvgDraw = ({ format }: { format: string[] }) => {
	return (
		<>
			<CloudUpload className="h-8 w-8" />
			<p className="mb-1 text-center text-sm text-foreground">
				<span className="font-semibold">Нажмите, чтобы загрузить</span>
				&nbsp;или перетащите и отпустите
			</p>
			<p className="text-xs text-foreground">
				{format.reduce((acc, title) => (acc += ', ' + title.toUpperCase()), '')}
			</p>
		</>
	)
}

interface UploadProps extends FileUploaderProps {}

const Upload: FC<UploadProps> = ({ dropzoneOptions, value, ...props }) => {
	const { accept } = dropzoneOptions
	const _dropZoneConfig: DropzoneOptions = dropzoneOptions

	return (
		<FileUploader
			value={value}
			dropzoneOptions={_dropZoneConfig}
			className="relative rounded-md bg-background p-1"
			{...props}
		>
			<FileInput className="rounded-md outline-dashed outline-2 outline-border">
				<div className="flex w-full flex-col items-center justify-center px-5 pb-4 pt-3">
					<FileSvgDraw format={Object.keys(accept!)} />
				</div>
			</FileInput>
			<FileUploaderContent>
				{value &&
					value.length > 0 &&
					value.map((file, i) => (
						<FileUploaderItem key={i} index={i}>
							<Paperclip className="h-4 w-4 stroke-current" />
							<span>{file.name}</span>
						</FileUploaderItem>
					))}
			</FileUploaderContent>
		</FileUploader>
	)
}

export const BaseFieldUpload: AssignComponent<
	'input',
	BaseFieldUploadProps
> = ({
	as = Upload,
	label,
	description,
	name,
	defaultValue = null,
	disabled,
	rules,
	shouldUnregister,
	labelProps,
	descriptionProps,
	messageProps,
	...inputProps
}) => {
	const form = useFormField()
	const Comp = as
	return (
		<FormField
			control={form.control}
			name={name}
			defaultValue={defaultValue}
			disabled={disabled}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={({ field }) => {
				const { value, onChange, ..._field } = field
				return (
					<FormItem>
						{label && (
							<FormLabel {...labelProps} className={cn(labelProps?.className)}>
								{label}
							</FormLabel>
						)}
						<FormControl>
							<Comp
								disabled={disabled}
								{...inputProps}
								value={value}
								onValueChange={onChange}
								{..._field}
							/>
						</FormControl>
						{description && (
							<FormDescription {...descriptionProps}>
								{description}
							</FormDescription>
						)}
						<FormMessage {...messageProps} />
					</FormItem>
				)
			}}
		/>
	)
}
