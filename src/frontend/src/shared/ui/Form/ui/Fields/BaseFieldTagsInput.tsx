import type { Command as CommandPrimitive } from 'cmdk'
import { UseControllerProps } from 'react-hook-form'
import { TagsInput } from '@/entities/TagsInput'
import { cn } from '@/shared/lib'
import { AssignComponent } from '@/shared/types'
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

interface BaseFieldTagsInputProps extends UseControllerProps, BaseFieldProps {
	labelProps?: LabelProps
	defaultValue?: string[]
	options?: string[]
}

export const BaseFieldTagsInput: AssignComponent<
	typeof CommandPrimitive,
	BaseFieldTagsInputProps
> = ({
	as = TagsInput,
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
								value={value}
								onValueChange={onChange}
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
