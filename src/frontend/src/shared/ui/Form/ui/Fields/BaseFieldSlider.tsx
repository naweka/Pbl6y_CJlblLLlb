import type { FC } from 'react'
import { UseControllerProps } from 'react-hook-form'
import { cn } from '@/shared/lib'
import { Slider, SliderProps } from '@/shared/ui/Slider'
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

interface BaseFieldSliderProps
	extends Omit<SliderProps, 'defaultValue' | 'name' | 'type' | 'dir'>,
		BaseFieldProps,
		UseControllerProps {
	labelProps?: LabelProps
	defaultValue?: string
}

export const BaseFieldSlider: FC<BaseFieldSliderProps> = ({
	label,
	description,
	name,
	defaultValue = '',
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
			defaultValue={defaultValue}
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
							<Slider
								disabled={disabled}
								value={[value]}
								defaultValue={[value]}
								onValueChange={(value) => onChange(value[0])}
								{...inputProps}
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
