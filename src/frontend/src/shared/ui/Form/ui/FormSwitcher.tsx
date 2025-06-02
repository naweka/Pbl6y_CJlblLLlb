import { FC } from 'react'
import { FieldTypes, FormSwitcherProps } from '../types'
import { BaseForm } from '.'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapComponent: Record<FieldTypes, FC<any>> = {
	[FieldTypes.Input]: (props) => <BaseForm.BaseFieldInput {...props} />,
	[FieldTypes.MultiSelect]: (props) => (
		<BaseForm.BaseFieldMultiSelect {...props} />
	),
	[FieldTypes.Select]: (props) => <BaseForm.BaseFieldSelect {...props} />,
	[FieldTypes.Textarea]: (props) => <BaseForm.BaseFieldTextarea {...props} />,
	[FieldTypes.TagsInput]: (props) => <BaseForm.BaseFieldTagsInput {...props} />,
	[FieldTypes.Slider]: (props) => <BaseForm.BaseFieldSlider {...props} />,
}

export const FormSwitcher: FC<FormSwitcherProps> = (field) => {
	const { component } = field
	const Component = MapComponent[component] ?? null
	if (!Component) return null
	return <Component {...field} />
}
