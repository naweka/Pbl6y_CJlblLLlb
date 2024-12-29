import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { useEditableContext } from './use-editable-context'

export interface EditableControlBaseProps extends PolymorphicProps {}
export interface EditableControlProps
	extends React.HTMLAttributes<HTMLDivElement>,
		EditableControlBaseProps {}

export const EditableControl = forwardRef<HTMLDivElement, EditableControlProps>(
	(props, ref) => {
		const editable = useEditableContext()
		const { className, ...mergedProps } = mergeProps(
			editable.getControlProps(),
			props,
		) as EditableControlProps
		return (
			<div
				className={cn('inline-flex items-center gap-1.5', className)}
				{...mergedProps}
				ref={ref}
			/>
		)
	},
)

EditableControl.displayName = 'EditableControl'
