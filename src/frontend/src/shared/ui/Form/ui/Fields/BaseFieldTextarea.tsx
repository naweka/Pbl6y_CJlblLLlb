import { UseControllerProps } from 'react-hook-form'
import { cn } from '@/shared/lib'
import { AssignComponent } from '@/shared/types'
import { Textarea, TextareaProps } from '@/shared/ui/Textarea'
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

interface BaseFieldTextareaProps
	extends Omit<TextareaProps, 'name'>,
		BaseFieldProps,
		UseControllerProps {
	labelProps?: LabelProps
	descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>
	messageProps?: React.HTMLAttributes<HTMLParagraphElement>
	defaultValue?: string
}

export const BaseFieldTextarea: AssignComponent<
	'input',
	BaseFieldTextareaProps
> = ({
	as = Textarea,
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
	...inputProps
}) => {
	const form = useFormField()
	const Comp = as
	return (
		<FormField
			control={form.control}
			name={name}
			defaultValue={defaultValue}
			disabled={disabled}
			rules={rules}
			shouldUnregister={shouldUnregister}
			render={({ field }) => (
				<FormItem>
					<FormLabel {...labelProps} className={cn(labelProps?.className)}>
						{label}
					</FormLabel>
					<FormControl>
						<Comp disabled={disabled} {...inputProps} {...field} />
					</FormControl>
					<FormDescription {...descriptionProps}>{description}</FormDescription>
					<FormMessage {...messageProps} />
				</FormItem>
			)}
		/>
	)
}
