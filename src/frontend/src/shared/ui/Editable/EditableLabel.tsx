import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'
import { Label, LabelProps } from '../Label'

export interface EditableLabelBaseProps extends PolymorphicProps { }
export interface EditableLabelProps extends LabelProps, EditableLabelBaseProps { }

export const EditableLabel = forwardRef<HTMLLabelElement, EditableLabelProps>((props, ref) => {
    const editable = useEditableContext()
    const mergedProps = mergeProps(editable.getLabelProps(), props)

    return <Label {...mergedProps} ref={ref} />
})

EditableLabel.displayName = 'EditableLabel'