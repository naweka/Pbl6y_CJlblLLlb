import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { BaseForm, Form } from '@/shared/ui'

interface TagsEditable {}

export const TagsEditable: FC<TagsEditable> = () => {
	const form = useForm()

	// const onSubmit = async (payload: any) => {
	//     console.log(payload);
	// }

	return (
		<Form {...form}>
			<BaseForm.BaseFieldMultiSelect name="tags" isCreatable />
		</Form>
	)
}
