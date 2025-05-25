import { z } from 'zod'
import { FieldTypes, FormSwitcherProps } from '@/shared/ui'

type FieldKey =
	| 'window_size'
	| 'window_step'
	| 'min_sound_length'
	| 'ignore_noise_outliers'
	| 'ignore_sound_outliers'
	| 'confidence_limit'
	| 'offset_bounds'

export const FIELDS_CARD: Record<FieldKey, FormSwitcherProps> = {
	window_size: {
		name: 'window_size',
		component: FieldTypes.Slider,
		label: 'Длина окна для модели',
	},
	window_step: {
		name: 'window_step',
		component: FieldTypes.Slider,
		label: 'Интервал движения окна',
	},
	min_sound_length: {
		name: 'min_sound_length',
		component: FieldTypes.Slider,
		label: 'Минимальная длина звука',
	},
	ignore_noise_outliers: {
		name: 'ignore_noise_outliers',
		component: FieldTypes.MultiSelect,
		label: 'Игнорировать вброс шума',
	},
	ignore_sound_outliers: {
		name: 'ignore_sound_outliers',
		component: FieldTypes.MultiSelect,
		label: 'Игнорировать вброс звука',
	},
	confidence_limit: {
		name: 'confidence_limit',
		component: FieldTypes.Slider,
		label: 'Порог средней уверенности модели на интервале со звуком',
	},
	offset_bounds: {
		name: 'offset_bounds',
		component: FieldTypes.Slider,
		label: 'Обрезка интервалов с краёв',
	},
}

export const optionsIgnoreNoiseOutliers = [
	{
		value: 'cut_when_at_least_one',
		label: 'Вырезать, когда будет меньше одного',
	},
	{
		value: 'cut_when_more_than_one',
		label: 'Вырезать, когда будет больше одного',
	},
	{
		value: 'no_cut',
		label: 'Не вырезать',
	},
]

export const optionsIgnoreSoundOutliers = [
	{
		value: 'insert_when_at_least_one',
		label: 'Вставлять, когда хотя бы один',
	},
	{
		value: 'insert_when_more_than_one',
		label: 'Вставлять, когда их будет больше одного',
	},
	{
		value: 'no_insert',
		label: 'Не вставлять',
	},
]

const numberField = z.coerce
	.number({ message: 'Обязательное поле' })
	.min(0, 'Не может быть отрицательным числом')
	.refine((value) => value > 0, { message: 'Цена обязательно' })

const stringField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

export const formSchema = z.object({
	window_size: numberField,
	window_step: numberField,
	min_sound_length: numberField,
	ignore_noise_outliers: stringField,
	ignore_sound_outliers: stringField,
	confidence_limit: numberField,
	offset_bounds: numberField,
})
