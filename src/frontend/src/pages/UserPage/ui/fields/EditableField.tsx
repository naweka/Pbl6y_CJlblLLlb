import { LucideCheck, LucidePencilLine, LucideX } from 'lucide-react'
import { FC } from 'react'
import {
	EditableCancelTrigger,
	EditableControl,
	EditableEditTrigger,
	EditableInput,
	EditablePreview,
	EditableRoot,
	EditableRootProps,
	EditableSubmitTrigger,
	Label,
} from '@/shared/ui'

interface EditableFieldProps extends EditableRootProps {}

export const EditableField: FC<EditableFieldProps> = ({
	disabled,
	title,
	...props
}) => {
	return (
		<EditableRoot
			submitMode="enter"
			activationMode="dblclick"
			className="items-end"
			disabled={disabled}
			autoResize
			{...props}
		>
			<div className="flex w-auto flex-col gap-0.5">
				<Label className="p-1 text-xl">{title}</Label>
				<div className="inline-grid h-10 w-fit">
					<EditablePreview className="inline overflow-hidden text-ellipsis whitespace-nowrap border border-transparent text-lg leading-8" />
					<EditableInput className="w-auto text-lg" />
					{!disabled && (
						<EditableControl className="h-10 p-1" style={{ gridArea: '1 / 2' }}>
							<EditableEditTrigger asChild>
								<LucidePencilLine />
							</EditableEditTrigger>
							<EditableCancelTrigger asChild>
								<LucideX />
							</EditableCancelTrigger>
							<EditableSubmitTrigger asChild>
								<LucideCheck />
							</EditableSubmitTrigger>
						</EditableControl>
					)}
				</div>
			</div>
		</EditableRoot>
	)
}
