import { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { buttonVariants } from '../Button'
import { useEditableContext } from './use-editable-context'

export interface EditableSubmitTriggerBaseProps extends PolymorphicProps {}
export interface EditableSubmitTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants>,
		EditableSubmitTriggerBaseProps {}

export const EditableSubmitTrigger = forwardRef<
	HTMLButtonElement,
	EditableSubmitTriggerProps
>((props, ref) => {
	const editable = useEditableContext()
	const {
		className,
		variant = 'ghost',
		size = 'icon',
		...mergedProps
	} = mergeProps<EditableSubmitTriggerProps>(
		editable.getSubmitTriggerProps(),
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

EditableSubmitTrigger.displayName = 'EditableSubmitTrigger'
