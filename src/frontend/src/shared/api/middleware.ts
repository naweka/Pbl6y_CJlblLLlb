import { AxiosResponse } from 'axios'
import merge from 'lodash.merge'
import { authStore } from '@/entities/Auth'
import { showToast } from '../hooks'

const notificationsToast = (response: AxiosResponse) => {
	if (response?.data?.error_message?.length > 0) {
		showToast({
			variant: 'destructive',
			description: response?.data?.error_message,
			title: 'Error',
			duration: 3000,
		})
	}
}

const mapStatus: Record<number, any> = {
	401: async (response: AxiosResponse) => {
		if (!(response.statusText === 'UNAUTHORIZED')) return
		await authStore.logout()
	},
}

const status = async (response: AxiosResponse) => {
	const callback = mapStatus[response?.status]
	await callback?.(response)
}

const defaultMiddleware = {
	status,
	notificationsToast,
}

export function middlewaresCommon(
	response: AxiosResponse,
	middleware: any = {},
	typeMiddlewareNotPriority: string[] = [],
) {
	const mergeMiddleware = merge({}, defaultMiddleware, middleware)
	const MiddlewareOrderCallbackKey = Object.keys(mergeMiddleware).sort(
		(a, b) =>
			typeMiddlewareNotPriority.indexOf(a) -
			typeMiddlewareNotPriority.indexOf(b),
	)
	MiddlewareOrderCallbackKey.forEach((key) => {
		const callback = mergeMiddleware[key]
		callback(response)
	})
}
