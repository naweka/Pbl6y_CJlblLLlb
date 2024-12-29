import { forwardRef } from 'react'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { useEditableContext } from './use-editable-context'

export interface EditableAreaBaseProps extends PolymorphicProps {}
export interface EditableAreaProps
	extends React.HTMLAttributes<HTMLDivElement>,
		EditableAreaBaseProps {}

export const EditableArea = forwardRef<HTMLDivElement, EditableAreaProps>(
	(props, ref) => {
		const editable = useEditableContext()
		const mergedProps = mergeProps(editable.getAreaProps(), props)

		return <div {...mergedProps} ref={ref} />
	},
)

EditableArea.displayName = 'EditableArea'
