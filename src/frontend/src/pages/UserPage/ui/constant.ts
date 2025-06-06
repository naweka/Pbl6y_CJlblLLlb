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
		hintMsg:
			'Длина интервала аудио (в секундах), который будет за раз обрабатываться моделью. Рекомендовано от 0.5 до 1 секунды.',
	},
	window_step: {
		name: 'window_step',
		component: FieldTypes.Slider,
		label: 'Интервал движения окна',
		hintMsg:
			'На сколько секунд будет сдвинуто окно обработки. Рекомендовано треть или четверть от длины окна.',
	},
	min_sound_length: {
		name: 'min_sound_length',
		component: FieldTypes.Slider,
		label: 'Минимальная длина звука',
		hintMsg:
			'Если интервал предсказания получился меньше этого значения — не добавлять его в результат.',
	},
	ignore_noise_outliers: {
		name: 'ignore_noise_outliers',
		component: FieldTypes.Select,
		label: 'Политика работы с вбросами шума',
		hintMsg:
			'В зависимости от значения, делить или не делить один интервал на два, если посреди большого интервала возникает короткий кусочек шума.',
	},
	ignore_sound_outliers: {
		name: 'ignore_sound_outliers',
		component: FieldTypes.Select,
		label: 'Политика работы с вбросами звука',
		hintMsg:
			'В зависимости от значения, вставлять или не вставлять предсказание короткого кусочка звука, который возник в шуме.',
	},
	confidence_limit: {
		name: 'confidence_limit',
		component: FieldTypes.Slider,
		label: 'Порог средней уверенности модели на интервале со звуком',
		hintMsg:
			'Нижняя граница средней уверенности в предсказанном интервале, начиная с которой, интервал будет добавлен.',
	},
	offset_bounds: {
		name: 'offset_bounds',
		component: FieldTypes.Slider,
		label: 'Обрезка интервалов с краёв',
		hintMsg:
			'Возможность обрезать интервалы с краёв на некоторый % от длины окна.',
	},
}

export const optionsIgnoreNoiseOutliers = [
	{
		value: 'cut_when_at_least_one',
		label: 'Делить интервал, когда есть хотябы один вброс шума',
	},
	{
		value: 'cut_when_more_than_one',
		label: 'Делить интервал, когда есть более одного вброса шума',
	},
	{
		value: 'no_cut',
		label: 'Игнорировать вбросы шума',
	},
]

export const optionsIgnoreSoundOutliers = [
	{
		value: 'insert_when_at_least_one',
		label: 'Добавлять интервал, если есть хотябы один предикт звука',
	},
	{
		value: 'insert_when_more_than_one',
		label: 'Добавлять интервал, если есть более одного предикта звука',
	},
	{
		value: 'no_insert',
		label: 'Игнорировать вбросы звука',
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
