import { VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { buttonVariants } from '../Button'
import { useEditableContext } from './use-editable-context'

export interface EditableEditTriggerBaseProps extends PolymorphicProps {}
export interface EditableEditTriggerProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants>,
		EditableEditTriggerBaseProps {}

export const EditableEditTrigger = forwardRef<
	HTMLButtonElement,
	EditableEditTriggerProps
>((props, ref) => {
	const editable = useEditableContext()
	const {
		className,
		variant = 'ghost',
		size = 'icon',
		...mergedProps
	} = mergeProps<EditableEditTriggerProps>(
		editable.getEditTriggerProps(),
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

EditableEditTrigger.displayName = 'EditableEditTrigger'
