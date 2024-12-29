import { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { buttonVariants } from '../Button'
import { useEditableContext } from './use-editable-context'

export interface EditableCancelTriggerBaseProps extends PolymorphicProps {}
export interface EditableCancelTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants>,
		EditableCancelTriggerBaseProps {}

export const EditableCancelTrigger = forwardRef<
	HTMLButtonElement,
	EditableCancelTriggerProps
>((props, ref) => {
	const editable = useEditableContext()
	const {
		className,
		variant = 'ghost',
		size = 'icon',
		...mergedProps
	} = mergeProps<EditableCancelTriggerProps>(
		editable.getCancelTriggerProps(),
		props,
	)
	return (
		<button
			className={cn(buttonVariants({ variant, size }), className)}
			{...mergedProps}
			ref={ref}
		/>
	)
})

EditableCancelTrigger.displayName = 'EditableCancelTrigger'
