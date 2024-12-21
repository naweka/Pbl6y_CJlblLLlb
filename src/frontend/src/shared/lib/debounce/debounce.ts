export function debounce(
	func: Function,
	wait: number = 250,
	immediate?: boolean,
) {
	let timeout: string | number | NodeJS.Timeout | null | undefined
	return function (this: any) {
		const context = this,
			args = arguments
		if (timeout !== null) clearTimeout(timeout)
		if (immediate && !timeout) func.apply(context, args)
		timeout = setTimeout(function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}, wait)
	}
}
