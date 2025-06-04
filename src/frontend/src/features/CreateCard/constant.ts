import { z } from 'zod'
import { FieldTypes, FormSwitcherProps } from '@/shared/ui'

type FieldKey = 'title' | 'tags' | 'description'

export const FIELDS_CARD: Record<FieldKey, FormSwitcherProps> = {
	title: {
		name: 'title',
		component: FieldTypes.Input,
		label: 'Имя карточки',
	},
	tags: {
		name: 'tags',
		component: FieldTypes.MultiSelect,
		label: 'Теги',
	},
	description: {
		name: 'description',
		component: FieldTypes.Textarea,
		label: 'Описание',
		className: 'max-h-36',
	},
}

const titleField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const descriptionField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const tagsField = z.array(z.string())
// .min(1, { message: 'Данное поле является обязательным для заполнения!' })

export const formSchemaValidateCard = z.object({
	title: titleField,
	description: descriptionField,
	tags: tagsField,
})
