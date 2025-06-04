import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { Input } from '../Input'
import { useEditableContext } from './use-editable-context'

export interface EditableInputBaseProps extends PolymorphicProps {}
export interface EditableInputProps
	extends React.InputHTMLAttributes<HTMLInputElement>,
		EditableInputBaseProps {}

export const EditableInput = forwardRef<HTMLInputElement, EditableInputProps>(
	(props, ref) => {
		const editable = useEditableContext()
		const { className, ...mergedProps } = mergeProps(
			editable.getInputProps(),
			props,
		) as EditableInputProps
		return (
			<Input
				className={cn(
					'w-full rounded-md px-1 py-1 transition placeholder:opacity-60',
					className,
				)}
				{...mergedProps}
				ref={ref}
			/>
		)
	},
)

EditableInput.displayName = 'EditableInput'
