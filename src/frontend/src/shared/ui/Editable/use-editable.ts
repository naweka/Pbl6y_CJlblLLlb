import { useId } from 'react'
import type { Optional } from '@/shared/types'
import * as editable from '@zag-js/editable'
import { normalizeProps, useMachine } from '@zag-js/react'
import type { PropTypes } from '@zag-js/types'

export interface UseEditableProps
	extends Optional<Omit<editable.Props, 'dir' | 'getRootNode'>, 'id'> {}

export interface UseEditableReturn extends editable.Api<PropTypes> {}

export const useEditable = (
	props: UseEditableProps = {},
): UseEditableReturn => {
	const id = useId()

	const machineProps: editable.Props = {
		...props,
		id,
	}

	const service = useMachine(editable.machine, machineProps)
	return editable.connect(service, normalizeProps)
}
