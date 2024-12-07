import { HTMLAttributes, InputHTMLAttributes } from 'react'

export enum FieldTypes {
	Input = 'Input',
	MultiSelect = 'MultiSelect',
	Textarea = 'Textarea',
	TagsInput = 'TagsInput',
}

export type BaseFieldProps = {
	name: string
	disabled?: boolean
	label?: string
	placeholder?: string
	description?: string
	required?: boolean
	descriptionProps?: React.HTMLAttributes<HTMLParagraphElement>
	messageProps?: React.HTMLAttributes<HTMLParagraphElement>
}

export type FormSwitcherProps = BaseFieldProps &
	Omit<Partial<HTMLAttributes<HTMLElement>>, 'defaultValue'> &
	Pick<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
		component: FieldTypes
	}
