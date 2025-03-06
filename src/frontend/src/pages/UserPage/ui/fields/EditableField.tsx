import { FC } from 'react'
import { LucideCheck, LucidePencilLine, LucideX } from 'lucide-react'

import { EditableCancelTrigger, EditableControl, EditableEditTrigger, EditableInput, EditablePreview, EditableRoot, EditableRootProps, EditableSubmitTrigger, Label } from '@/shared/ui'

interface EditableFieldProps extends EditableRootProps { }

export const EditableField: FC<EditableFieldProps> = ({ disabled, title, ...props }) => {
  return (
    <EditableRoot
      submitMode="enter"
      activationMode="dblclick"
      className='items-end'
      disabled={disabled}
      autoResize
      {...props}
    >
      <div className='flex flex-col gap-0.5 w-auto'>
        <Label className='text-xl p-1'>{title}</Label>
        <div className='inline-grid h-10 w-fit'>
          <EditablePreview className='text-lg whitespace-nowrap overflow-hidden text-ellipsis inline border border-transparent leading-8' />
          <EditableInput className='text-lg w-auto' />
          {!disabled && (
            <EditableControl className='p-1 h-10' style={{ gridArea: "1 / 2" }}>
              <EditableEditTrigger asChild>
                <LucidePencilLine />
              </EditableEditTrigger>
              <EditableCancelTrigger asChild>
                <LucideX />
              </EditableCancelTrigger>
              <EditableSubmitTrigger asChild>
                <LucideCheck />
              </EditableSubmitTrigger>
            </EditableControl>
          )}
        </div>
      </div>

    </EditableRoot>
  )
}
