import { forwardRef } from 'react'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { Label, LabelProps } from '../Label'
import { useEditableContext } from './use-editable-context'

export interface EditableLabelBaseProps extends PolymorphicProps {}
export interface EditableLabelProps
	extends LabelProps,
		EditableLabelBaseProps {}

export const EditableLabel = forwardRef<HTMLLabelElement, EditableLabelProps>(
	(props, ref) => {
		const editable = useEditableContext()
		const mergedProps = mergeProps(editable.getLabelProps(), props)

		return <Label {...mergedProps} ref={ref} />
	},
)

EditableLabel.displayName = 'EditableLabel'
