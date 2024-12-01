import { InputHTMLAttributes } from 'react'

export enum FieldTypes {
	Input = 'Input',
}

export type BaseFieldProps = InputHTMLAttributes<HTMLInputElement> & {
	name: string
	disabled?: boolean
	label?: string
	placeholder?: string
	description?: string
	required?: boolean
}

export type FormSwitcherProps = BaseFieldProps & { component: FieldTypes }
