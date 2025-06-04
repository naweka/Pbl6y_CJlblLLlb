import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { cn } from '@/shared/lib'
import { Label, Switch } from '@/shared/ui'

interface EditProps extends React.HTMLAttributes<HTMLDivElement> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export const Edit: FC<EditProps> = observer(
	({ className, onCheckedChange, checked, ...props }) => {
		return (
			<div className={cn('flex items-center space-x-2', className)} {...props}>
				<Switch id="edit" onCheckedChange={onCheckedChange} checked={checked} />
				<Label htmlFor="edit">Редактировать</Label>
			</div>
		)
	},
)
