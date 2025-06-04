type Type =
	| 'string'
	| 'number'
	| 'boolean'
	| 'array'
	| 'object'
	| 'null'
	| 'undefined'
	| 'date'
	| 'regexp'
	| 'bigint'
	| 'symbol'
	| 'function'

export const typeOf = (value: any): Type => {
	const match = toString.call(value).match(/\[object (\w+)]/)
	return match ? (match[1].toLowerCase() as Type) : 'undefined'
}
