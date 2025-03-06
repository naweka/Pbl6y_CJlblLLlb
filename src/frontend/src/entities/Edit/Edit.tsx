import { Label, Switch } from '@/shared/ui'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'

interface EditProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export const Edit: FC<EditProps> = observer((props) => {
  return (
    <div className="flex items-center space-x-2" >
      <Switch
        {...props}
        id="edit"
      />
      <Label htmlFor="edit" > Редактировать </Label>
    </div>
  )
})
