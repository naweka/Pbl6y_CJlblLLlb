import { forwardRef } from 'react'
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorProps,
	MultiSelectorTrigger,
} from '@/shared/ui'

export interface MultiSelectProps extends Partial<MultiSelectorProps> {
	options?: string[]
	placeholder?: string
	triggerProps?: React.HTMLAttributes<HTMLDivElement>
}

export const MultiSelect = forwardRef<HTMLDivElement, MultiSelectProps>(
	(
		{ values, onValuesChange, placeholder, options, triggerProps, ...props },
		ref,
	) => {
		return (
			<MultiSelector
				values={values || []}
				onValuesChange={(value) => onValuesChange?.(value)}
				loop
				{...props}
			>
				<MultiSelectorTrigger {...triggerProps} ref={ref}>
					<MultiSelectorInput placeholder={placeholder} />
				</MultiSelectorTrigger>
				<MultiSelectorContent>
					<MultiSelectorList>
						{options?.map((val) => (
							<MultiSelectorItem key={val} value={val}>
								{val}
							</MultiSelectorItem>
						))}
					</MultiSelectorList>
				</MultiSelectorContent>
			</MultiSelector>
		)
	},
)
