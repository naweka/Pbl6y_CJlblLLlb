import type { Command as CommandPrimitive } from 'cmdk'
import { forwardRef } from 'react'
import { UseControllerProps } from 'react-hook-form'
import { cn } from '@/shared/lib'
import { AssignComponent } from '@/shared/types'
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorProps,
	MultiSelectorTrigger,
} from '@/shared/ui/MultiSelect'
import { LabelProps } from '@radix-ui/react-label'
import { BaseFieldProps } from '../../types'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useFormField,
} from '../Form'

interface BaseFieldMultiSelectProps
	extends UseControllerProps,
		BaseFieldProps,
		Partial<Omit<MultiSelectorProps, 'defaultValue'>> {
	labelProps?: LabelProps
	defaultValue?: string[]
	options?: string[]
}

const MultiSelect = forwardRef<
	HTMLDivElement,
	MultiSelectorProps & { options?: string[]; placeholder?: string }
>(({ values, onValuesChange, placeholder, options, ...props }, ref) => {
	return (
		<MultiSelector
			values={values || []}
			onValuesChange={onValuesChange}
			loop
			{...props}
		>
			<MultiSelectorTrigger ref={ref}>
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
})

MultiSelect.displayName = 'MultiSelect'

export const BaseFieldMultiSelect: AssignComponent<
	typeof CommandPrimitive,
	BaseFieldMultiSelectProps
> = ({
	as = MultiSelect,
	label,
	description,
	name,
	defaultValue = [],
	disabled,
	rules,
	shouldUnregister,
	labelProps,
	descriptionProps,
	messageProps,
	...inputProps
}) => {
	const form = useFormField()
	const Comp = as
	return (
		<FormField
			control={form.control}
			name={name}
			defaultValue={defaultValue || []}
			disabled={disabled}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={({ field }) => {
				const { value, onChange, ..._field } = field
				return (
					<FormItem>
						<FormLabel {...labelProps} className={cn(labelProps?.className)}>
							{label}
						</FormLabel>
						<FormControl>
							<Comp
								{...inputProps}
								values={value}
								onValuesChange={onChange}
								{..._field}
							/>
						</FormControl>
						<FormDescription {...descriptionProps}>
							{description}
						</FormDescription>
						<FormMessage {...messageProps} />
					</FormItem>
				)
			}}
		/>
	)
}
