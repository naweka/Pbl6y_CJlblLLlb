import { forwardRef } from 'react'
import { cn } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { useEditableContext } from './use-editable-context'

export interface EditablePreviewBaseProps extends PolymorphicProps {}
export interface EditablePreviewProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		EditablePreviewBaseProps {}

export const EditablePreview = forwardRef<
	HTMLSpanElement,
	EditablePreviewProps
>((props, ref) => {
	const editable = useEditableContext()
	const { className, ...mergedProps } = mergeProps(
		editable.getPreviewProps(),
		props,
	) as EditablePreviewProps
	return (
		<span
			className={cn(
				'inline-flex h-10 cursor-text items-center rounded-md px-1 py-1 text-sm transition hover:bg-muted data-[disabled]:pointer-events-none data-[disabled]:bg-transparent',
				className,
			)}
			{...mergedProps}
			ref={ref}
		/>
	)
})

EditablePreview.displayName = 'EditablePreview'
