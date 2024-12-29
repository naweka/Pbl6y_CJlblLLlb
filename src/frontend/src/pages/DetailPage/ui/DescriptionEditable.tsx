import { FC } from 'react'
import {
	EditablePreview,
	EditableRoot,
	EditableRootProps,
	EditableTextarea,
} from '@/shared/ui'

interface DescriptionEditableProps extends EditableRootProps {}

export const DescriptionEditable: FC<DescriptionEditableProps> = ({
	...props
}) => {
	return (
		<EditableRoot {...props}>
			<EditablePreview className="min-h-8 w-full text-base" />
			<EditableTextarea className="h-36 text-base md:text-base" />
		</EditableRoot>
	)
}
