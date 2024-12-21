import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { Label, Switch } from '@/shared/ui'
import { detailPageStore } from '../model'

export const Edit: FC = observer(() => {
	return (
		<div className="flex items-center space-x-2">
			<Switch
				checked={detailPageStore.edit}
				onCheckedChange={detailPageStore.setEdit}
				id="edit"
			/>
			<Label htmlFor="edit">Редактировать</Label>
		</div>
	)
})
