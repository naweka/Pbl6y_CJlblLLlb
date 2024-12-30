import { FC } from 'react'
import {
	EditableCancelTrigger,
	EditableControl,
	EditableEditTrigger,
	EditablePreview,
	EditableRoot,
	EditableRootProps,
	EditableSubmitTrigger,
	EditableTextarea,
} from '@/shared/ui'
import { detailPageStore } from '../model'
import { observer } from 'mobx-react-lite'
import { LucideCheck, LucidePencilLine, LucideX } from 'lucide-react'

interface DescriptionEditableProps extends EditableRootProps { }

export const DescriptionEditable: FC<DescriptionEditableProps> = observer(({
	...props
}) => {
	const disabled = !detailPageStore.edit
	return (
		<EditableRoot
			disabled={disabled}
			defaultValue={detailPageStore.card?.description}
			onValueCommit={({ value }) =>
				detailPageStore.onChange('description', value)
			}
			className='flex-col items-start gap-2'
			submitMode='enter'
			activationMode='dblclick'
			{...props}
		>
			<EditablePreview className="min-h-8 w-full text-base" />
			<EditableTextarea className="h-36 text-base md:text-base" />
			{!disabled && (
				<EditableControl className='w-full justify-end'>
					<EditableEditTrigger size='default'>
						Редактировать <LucidePencilLine />
					</EditableEditTrigger>
					<EditableCancelTrigger size='default'>
						Отменить <LucideX />
					</EditableCancelTrigger>
					<EditableSubmitTrigger size='default'>
						Сохранить <LucideCheck />
					</EditableSubmitTrigger>
				</EditableControl>
			)}
		</EditableRoot>
	)
})
