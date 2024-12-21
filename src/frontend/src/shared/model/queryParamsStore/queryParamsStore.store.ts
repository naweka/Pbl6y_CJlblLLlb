import { makeAutoObservable } from 'mobx'
import { createSearchParams } from 'react-router-dom'
import { isEmpty, typeOf } from '@/shared/lib'

type BuilderType = 'string' | 'array' | 'number' | 'boolean'

type BuilderReturnType<T extends BuilderType> = T extends 'string'
	? string
	: T extends 'array'
		? string[] | null
		: T extends 'number'
			? number
			: T extends 'boolean'
				? boolean
				: never

const mapBuilderDecode: Record<BuilderType, (value: any) => any> = {
	string: (value) => value,
	array: (value) => {
		if (value == null) return value
		if (value === '') return []
		return value.split(',')
	},
	number: (value) => value,
	boolean: (value) => value,
}

const mapBuilderEncode: Record<BuilderType, (value: any) => string> = {
	string: (value: any) => value,
	number: (value: any) => value,
	boolean: (value: any) => value,
	array: (value: any) => value.join(','),
}

class QueryParamsStore {
	queryParams: URLSearchParams | null = null

	constructor() {
		if (typeof window === 'undefined') return
		this.queryParams = new URLSearchParams(window.location.search)
		makeAutoObservable(this)
	}

	// Получение значения query-параметра
	getParam<T extends BuilderType = 'string'>(
		key: string,
		builder: T = 'string' as T,
	): BuilderReturnType<T> | null {
		return mapBuilderDecode[builder](this.queryParams?.get(key) || null)
	}

	// Установка или обновление query-параметра
	setParam<T extends unknown>(key: string, value: T) {
		const _value = mapBuilderEncode[typeOf(value) as BuilderType](value)
		if (isEmpty(_value)) {
			this.deleteParam(key)
			return
		}
		this.queryParams?.set(key, _value)
		this.updateUrl()
	}

	// Удаление query-параметра
	deleteParam(key: string) {
		this.queryParams?.delete(key)
		this.updateUrl()
	}

	// Приватный метод для обновления URL в браузере
	private updateUrl() {
		const newParams = createSearchParams(this.queryParams || '').toString()
		window.history.replaceState(null, '', `?${newParams}`)
	}

	// Получение всех query-параметров в виде объекта
	get allParams(): Record<string, string> {
		return Object.fromEntries(this.queryParams?.entries() || [])
	}
}

export default new QueryParamsStore()
