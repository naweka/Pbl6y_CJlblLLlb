import { FC } from 'react'
import { FieldTypes, FormSwitcherProps } from '../types'
import { BaseForm } from '.'

const MapComponent: Record<FieldTypes, FC<any>> = {
	[FieldTypes.Input]: (props) => <BaseForm.BaseFieldInput {...props} />,
	[FieldTypes.MultiSelect]: (props) => (
		<BaseForm.BaseFieldMultiSelect {...props} />
	),
	[FieldTypes.Textarea]: (props) => <BaseForm.BaseFieldTextarea {...props} />,
	[FieldTypes.TagsInput]: (props) => <BaseForm.BaseFieldTagsInput {...props} />,
}

export const FormSwitcher: FC<FormSwitcherProps> = (field) => {
	const { component } = field
	const Component = MapComponent[component] ?? null
	if (!Component) return null
	return <Component {...field} />
}
