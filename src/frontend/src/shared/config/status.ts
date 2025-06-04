export type STATUS_KEY = 'PREPARING' | 'ANALYZING' | 'READY' | 'ERROR' | 'DONE'

export type STATUS_VALUE = {
	color: string
	title: string
}

export const STATUS: Record<STATUS_KEY, STATUS_VALUE> = {
	PREPARING: {
		color: 'bg-stone-400',
		title: 'ПОДГОТОВКА',
	},
	ANALYZING: {
		color: 'bg-amber-500',
		title: 'ОБРАБОТКА',
	},
	READY: {
		color: 'bg-lime-500',
		title: 'ГОТОВО',
	},
	ERROR: {
		color: 'bg-red-600',
		title: 'ОШИБКА',
	},
	DONE: {
		color: 'bg-lime-500',
		title: 'ГОТОВО',
	},
}
