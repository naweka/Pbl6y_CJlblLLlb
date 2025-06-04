import { useCallback, useRef } from 'react'

type AnyFunction = (...args: any[]) => any

type Options = {
	/**
	 * Whether to use flushSync or not
	 */
	sync?: boolean
}

function useLatestRef<T>(value: T) {
	const ref = useRef(value)
	ref.current = value
	return ref
}

export function useEvent<T extends AnyFunction>(
	callback: T | undefined,
	opts: Options = {},
): T {
	const { sync = false } = opts

	const callbackRef = useLatestRef(callback)

	return useCallback(
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(...args: any[]) => {
			if (sync) return queueMicrotask(() => callbackRef.current?.(...args))
			return callbackRef.current?.(...args)
		},
		[sync, callbackRef],
	) as T
}
