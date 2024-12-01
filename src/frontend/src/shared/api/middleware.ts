import { AxiosResponse } from 'axios';
import merge from 'lodash.merge';
import { showToast } from '../hooks';


const notificationsToast = (response: AxiosResponse) => {
	if (response?.data?.error_message.length > 0) {
		showToast({
			variant: 'destructive',
			description:response?.data?.error_message,
			title: "Error",
			duration: 3000,
		})
	}
}

const defaultMiddleware = {
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