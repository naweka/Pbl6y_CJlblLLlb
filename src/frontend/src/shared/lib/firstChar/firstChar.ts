export function firstChar(chars: string): string {
	return chars
		.split(' ')
		.map((char) => char.charAt(0).toUpperCase())
		.slice(0, 2)
		.join('')
}
