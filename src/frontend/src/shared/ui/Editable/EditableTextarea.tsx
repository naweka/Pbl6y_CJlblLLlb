import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { Textarea, TextareaProps } from '../Textarea'
import { useEditableContext } from './use-editable-context'

export interface EditableTextareaBaseProps extends PolymorphicProps {}
export interface EditableTextareaProps
	extends TextareaProps,
		EditableTextareaBaseProps {}

export const EditableTextarea = forwardRef<
	HTMLTextAreaElement,
	EditableTextareaProps
>((props, ref) => {
	const editable = useEditableContext()
	const { className, ...mergedProps } = mergeProps(
		editable.getInputProps(),
		props,
	) as EditableTextareaProps
	return (
		<Textarea
			className={cn(
				'w-full rounded-md px-1 py-1 transition placeholder:opacity-60',
				className,
			)}
			{...mergedProps}
			ref={ref}
		/>
	)
})

EditableTextarea.displayName = 'EditableTextarea'
