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
} from '@/shared/ui'

interface HeaderEditableProps extends EditableRootProps {}

export const HeaderEditable: FC<HeaderEditableProps> = ({
	disabled,
	...props
}) => {
	return (
		<EditableRoot activationMode="dblclick" disabled={disabled} {...props}>
			<EditablePreview className="mb-2 inline-block overflow-hidden text-ellipsis whitespace-nowrap text-3xl sm:text-4xl md:text-left md:text-5xl" />
			<EditableInput className="mb-2 h-[44px] text-3xl sm:h-[48px] sm:text-4xl md:h-[56px] md:text-left md:text-5xl" />
			{!disabled && (
				<EditableControl>
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
		</EditableRoot>
	)
}
