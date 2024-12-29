export enum STATUS {
	INITIAL = 'init', // Процесс не запущен
	LOADING = 'loading', // Процесс в загрузке
	ERROR = 'error', // Завершить с ошибками
	SUCCESS = 'success', // Завершить успех
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type Assign<T, U> = Omit<T, keyof U> & U

export interface PolymorphicProps {
	/**
	 * Use the provided child element as the default rendered element, combining their props and behavior.
	 */
	asChild?: boolean
}
