import { z } from 'zod';
import { FieldTypes, FormSwitcherProps } from '@/shared/ui';


export const FIELDS_CARD: FormSwitcherProps[] = [
	{
		name: 'title',
		component: FieldTypes.Input,
		label: 'Имя карточки',
	},
	{
		name: 'description',
		component: FieldTypes.Input,
		label: 'Описание',
	},
	{
		name: 'files',
		component: FieldTypes.Input,
		label: 'Добавить файлы',
		type: 'file',
		multiple: true,
	},
]

const titleField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const descriptionField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const fileField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

export const formSchemaValidateCard = z.object({
	title: titleField,
	description: descriptionField,
	files: fileField,
})