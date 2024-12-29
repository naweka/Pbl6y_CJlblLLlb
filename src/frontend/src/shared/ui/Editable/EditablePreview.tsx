import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'
import { cn } from '@/shared/lib'

export interface EditablePreviewBaseProps extends PolymorphicProps { }
export interface EditablePreviewProps extends React.HTMLAttributes<HTMLSpanElement>, EditablePreviewBaseProps { }

export const EditablePreview = forwardRef<HTMLSpanElement, EditablePreviewProps>((props, ref) => {
    const editable = useEditableContext()
    const { className, ...mergedProps } = mergeProps(editable.getPreviewProps(), props) as EditablePreviewProps
    return <span className={cn("py-1 px-1 inline-flex items-center cursor-text rounded-md transition hover:bg-muted disabled:select-none", className)} {...mergedProps} ref={ref} />
})

EditablePreview.displayName = 'EditablePreview'