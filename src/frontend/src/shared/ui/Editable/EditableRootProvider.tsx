import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import type { UseEditableReturn } from './use-editable'
import { EditableProvider } from './use-editable-context'
import { createSplitProps } from '@/shared/lib'
import { PolymorphicProps } from '@/shared/types'

interface RootProviderProps {
    value: UseEditableReturn
}

export interface EditableRootProviderBaseProps extends RootProviderProps, PolymorphicProps { }
export interface EditableRootProviderProps
    extends React.HTMLAttributes<HTMLDivElement>,
    EditableRootProviderBaseProps { }

export const EditableRootProvider = forwardRef<HTMLDivElement, EditableRootProviderProps>(
    (props, ref) => {
        const [{ value: editable }, localProps] = createSplitProps<RootProviderProps>()(props, [
            'value',
        ])
        const mergedProps = mergeProps(editable.getRootProps(), localProps)

        return (
            <EditableProvider value={editable}>
                <div {...mergedProps} ref={ref} />
            </EditableProvider>
        )
    },
)

EditableRootProvider.displayName = 'EditableRootProvider'