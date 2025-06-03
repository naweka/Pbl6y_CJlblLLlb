import { HTMLAttributes, InputHTMLAttributes } from 'react'

export enum FieldTypes {
	Input = 'Input',
	MultiSelect = 'MultiSelect',
	Select = 'Select',
	Textarea = 'Textarea',
	TagsInput = 'TagsInput',
	Slider = 'Slider',
}

export type BaseFieldProps = {
	name: string
	disabled?: boolean
	label?: string
	placeholder?: string
	description?: string
	required?: boolean
	hintMsg?: string
	descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>
	messageProps?: React.HTMLAttributes<HTMLParagraphElement>
}

export type FormSwitcherProps = BaseFieldProps &
	Omit<Partial<HTMLAttributes<HTMLElement>>, 'defaultValue'> &
	Pick<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
		component: FieldTypes
	}
