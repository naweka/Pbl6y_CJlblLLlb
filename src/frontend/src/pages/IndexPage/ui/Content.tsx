import { FC } from 'react'
import { Card } from '@/entities/Card'
import { Link } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/ui'
import { EllipsisVertical, ExternalLink, Trash } from 'lucide-react'

const data = [
	{
		id: 1,
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		id: 2,
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		id: 3,
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		id: 4,
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
]

const ActionMore = () => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-10">
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => { }}>
						<ExternalLink />
						<span>Открыть</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Trash />
						<span>Удалить</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>

	)
}

export const Content: FC = () => {
	return (
		<div className="grid cursor-pointer gap-5 px-5 auto-fill-80">
			{data.map((data) => (
				<Card {...data} key={data.id} to={ROUTE_CONSTANTS.DETAIL_CARD.TO(data.id)} action={<ActionMore />} />
			))}
		</div>
	)
}
