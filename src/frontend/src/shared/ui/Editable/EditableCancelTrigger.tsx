import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'
import { buttonVariants } from '../Button'
import { cn } from '@/shared/lib'
import { VariantProps } from 'class-variance-authority'

export interface EditableCancelTriggerBaseProps extends PolymorphicProps { }
export interface EditableCancelTriggerProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants>,
    EditableCancelTriggerBaseProps { }

export const EditableCancelTrigger = forwardRef<HTMLButtonElement, EditableCancelTriggerProps>(
    (props, ref) => {
        const editable = useEditableContext()
        const { className, variant = 'ghost', size, ...mergedProps } = mergeProps<EditableCancelTriggerProps>(editable.getCancelTriggerProps(), props)
        return <button className={cn(buttonVariants({ variant, size }), className)} {...mergedProps} ref={ref} />
    },
)

EditableCancelTrigger.displayName = 'EditableCancelTrigger'