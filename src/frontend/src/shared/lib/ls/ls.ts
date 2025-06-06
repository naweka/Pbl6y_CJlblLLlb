export const getItem = (key: string) =>
	JSON.parse(localStorage.getItem(key) ?? '{}')
export const setItem = (key: string, data: any) =>
	localStorage.setItem(key, JSON.stringify(data))
export const deleteItem = (key: string) => localStorage.removeItem(key)
