import { mergeProps } from '@zag-js/react'
import { forwardRef } from 'react'
import { useEditableContext } from './use-editable-context'
import { PolymorphicProps } from '@/shared/types'
import { cn } from '@/shared/lib'
import { Input } from '../Input'

export interface EditableInputBaseProps extends PolymorphicProps { }
export interface EditableInputProps extends React.InputHTMLAttributes<HTMLInputElement>, EditableInputBaseProps { }

export const EditableInput = forwardRef<HTMLInputElement, EditableInputProps>((props, ref) => {
    const editable = useEditableContext()
    const { className, ...mergedProps } = mergeProps(editable.getInputProps(), props) as EditableInputProps
    return <Input className={cn("py-1 px-1 transition w-full placeholder:opacity-60 rounded-md", className)} {...mergedProps} ref={ref} />
})

EditableInput.displayName = 'EditableInput'