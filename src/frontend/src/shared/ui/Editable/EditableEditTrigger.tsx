import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'
import { VariantProps } from 'class-variance-authority'
import { buttonVariants } from '../Button'
import { cn } from '@/shared/lib'

export interface EditableEditTriggerBaseProps extends PolymorphicProps { }
export interface EditableEditTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>,
    EditableEditTriggerBaseProps { }

export const EditableEditTrigger = forwardRef<HTMLButtonElement, EditableEditTriggerProps>(
    (props, ref) => {
        const editable = useEditableContext()
        const { className, variant = 'ghost', size, ...mergedProps } = mergeProps<EditableEditTriggerProps>(editable.getEditTriggerProps(), props)
        return <button className={cn(buttonVariants({ variant, size }), className)} {...mergedProps} ref={ref} />
    },
)

EditableEditTrigger.displayName = 'EditableEditTrigger'