import { FC, forwardRef } from 'react'
import { UseControllerProps } from 'react-hook-form'
import { cn } from '@/shared/lib'
import {
	SelectContent,
	SelectItem,
	SelectProps,
	SelectTrigger,
	SelectValue,
	Select as SharedSelect,
} from '@/shared/ui/Select'
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
import { HintTooltip } from '../HintTooltip'

interface BaseFieldSelectProps
	extends UseControllerProps,
		BaseFieldProps,
		Omit<SelectProps, 'defaultValue' | 'name' | 'dir'> {
	labelProps?: LabelProps
	defaultValue?: string[]
	options: { value: string; label: string }[]
	className?: string
}

const Select = forwardRef<
	HTMLButtonElement,
	SelectProps & {
		options?: { value: string; label: string }[]
		placeholder?: string
	}
>(({ placeholder, options, ...props }, ref) => {
	return (
		<SharedSelect {...props}>
			<FormControl>
				<SelectTrigger ref={ref}>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{options?.map(({ value, label }) => (
					<SelectItem key={value} value={value}>
						{label}
					</SelectItem>
				))}
			</SelectContent>
		</SharedSelect>
	)
})

Select.displayName = 'Select'

export const BaseFieldSelect: FC<BaseFieldSelectProps> = ({
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
	className,
	hintMsg,
	...inputProps
}) => {
	const form = useFormField()
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
					<FormItem className={className}>
						<FormLabel {...labelProps} className={cn(labelProps?.className)}>
							<span>{label}</span>
							{hintMsg && <HintTooltip text={hintMsg} />}
						</FormLabel>
						<FormControl>
							<Select
								{...inputProps}
								onValueChange={onChange}
								defaultValue={value}
								value={value}
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
