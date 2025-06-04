import { LucideCheck, LucidePencilLine, LucideX } from 'lucide-react'
import { observer } from 'mobx-react-lite'
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
import { detailPageStore } from '../model'

interface HeaderEditableProps extends EditableRootProps {}

export const HeaderEditable: FC<HeaderEditableProps> = observer(
	({ ...props }) => {
		const disabled = !detailPageStore.edit
		return (
			<EditableRoot
				className="w-full justify-center md:w-[calc(100%-159px)] md:justify-start"
				disabled={disabled}
				defaultValue={detailPageStore.card?.title}
				onValueCommit={({ value }) => detailPageStore.onChange('title', value)}
				submitMode="enter"
				activationMode="dblclick"
				{...props}
			>
				<EditablePreview className="mb-2 inline-block h-auto overflow-hidden text-ellipsis whitespace-nowrap text-3xl sm:text-4xl md:text-left md:text-5xl" />
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
	},
)
