import { forwardRef } from 'react'
import { cn, createSplitProps } from '@/shared/lib'
import type { Assign, PolymorphicProps } from '@/shared/types'
import { mergeProps } from '@zag-js/react'
import { useEditable, UseEditableProps } from './use-editable'
import { EditableProvider } from './use-editable-context'

export interface EditableRootBaseProps
	extends UseEditableProps,
		PolymorphicProps {}

export interface EditableRootProps
	extends Assign<React.HTMLAttributes<HTMLDivElement>, EditableRootBaseProps> {}

const EditableRoot = forwardRef<HTMLDivElement, EditableRootProps>(
	(props, ref) => {
		const [useEditableProps, localProps] = createSplitProps<UseEditableProps>()(
			props,
			[
				'activationMode',
				'autoResize',
				'defaultEdit',
				'defaultValue',
				'disabled',
				'edit',
				'edit.controlled',
				'finalFocusEl',
				'form',
				'id',
				'ids',
				'invalid',
				'maxLength',
				'name',
				'onEditChange',
				'onFocusOutside',
				'onInteractOutside',
				'onPointerDownOutside',
				'onValueChange',
				'onValueCommit',
				'onValueRevert',
				'placeholder',
				'readOnly',
				'required',
				'selectOnFocus',
				'submitMode',
				'translations',
				'value',
			],
		)
		const editable = useEditable(useEditableProps)
		const { className, ...mergedProps } = mergeProps(
			editable.getRootProps(),
			localProps,
		) as EditableRootProps

		return (
			<EditableProvider value={editable}>
				<div
					className={cn(
						'relative inline-flex w-full items-center gap-1.5',
						className,
					)}
					{...mergedProps}
					ref={ref}
				/>
			</EditableProvider>
		)
	},
)

export { EditableRoot }
