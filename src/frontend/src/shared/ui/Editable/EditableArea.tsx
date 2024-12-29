import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'

export interface EditableAreaBaseProps extends PolymorphicProps { }
export interface EditableAreaProps extends React.HTMLAttributes<HTMLDivElement>, EditableAreaBaseProps { }

export const EditableArea = forwardRef<HTMLDivElement, EditableAreaProps>((props, ref) => {
    const editable = useEditableContext()
    const mergedProps = mergeProps(editable.getAreaProps(), props)

    return <div {...mergedProps} ref={ref} />
})

EditableArea.displayName = 'EditableArea'