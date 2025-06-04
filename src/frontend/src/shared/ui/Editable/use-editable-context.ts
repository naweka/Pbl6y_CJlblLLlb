import { createContext } from '@/shared/lib'
import type { UseEditableReturn } from './use-editable'

export interface UseEditableContext extends UseEditableReturn {}

export const [EditableProvider, useEditableContext] =
	createContext<UseEditableContext>({
		name: 'EditableContext',
		hookName: 'useEditableContext',
		providerName: '<EditableProvider />',
	})
