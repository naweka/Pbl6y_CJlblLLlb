export function debounce(
	func: Function,
	wait: number = 250,
	immediate?: boolean,
) {
	var timeout: string | number | NodeJS.Timeout | null | undefined
	return function (this: any) {
		var context = this,
			args = arguments
		if (timeout !== null) clearTimeout(timeout)
		if (immediate && !timeout) func.apply(context, args)
		timeout = setTimeout(function () {
			timeout = null
			if (!immediate) func.apply(context, args)
		}, wait)
	}
}
