import { EllipsisVertical, ExternalLink, Trash } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardProps } from '@/entities/Card'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { STATUS } from '@/shared/types'
import {
	Button,
	DeadFish,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Spinner,
} from '@/shared/ui'
import { indexPageStore } from '../model'
import { AlertDelete } from './AlertDelete'

const ActionMore = (props: CardProps) => {
	const [open, setOpen] = useState(false)
	const { id, onDelete } = props
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<EllipsisVertical />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-10">
					<DropdownMenuGroup>
						<DropdownMenuItem asChild>
							<Link
								className="cursor-pointer"
								target="_blank"
								to={ROUTE_CONSTANTS.DETAIL_CARD.TO(id)}
							>
								<ExternalLink />
								<span>Открыть</span>
							</Link>
						</DropdownMenuItem>
						{onDelete && (
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => setOpen(true)}
							>
								<Trash />
								<span>Удалить</span>
							</DropdownMenuItem>
						)}
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDelete
				open={open}
				onOpenChange={setOpen}
				onClick={() => onDelete?.(id)}
			/>
		</>
	)
}

const MapComponent: Record<STATUS, FC> = {
	[STATUS.INITIAL]: () => <ContentLoading />,
	[STATUS.LOADING]: () => <ContentLoading />,
	[STATUS.SUCCESS]: () => <ContentSuccess />,
	[STATUS.ERROR]: () => <ContentError />,
}

const classes = 'flex justify-center items-center w-full flex-grow'

const ContentLoading = () => {
	return (
		<div className={classes}>
			<Spinner />
		</div>
	)
}

const ContentError = () => {
	return <div className={classes}>Что-то пошло не так...</div>
}

const ContentSuccess = observer(() => {
	return indexPageStore?.cards && indexPageStore.cards.length > 0 ? (
		<div className="grid w-full cursor-pointer gap-5 px-5 auto-fill-80">
			{indexPageStore.cards.map((data) => (
				<Card
					{...data}
					key={data.id}
					to={ROUTE_CONSTANTS.DETAIL_CARD.TO(data.id)}
					// eslint-disable-next-line @typescript-eslint/unbound-method
					onDelete={indexPageStore.deleteCard}
					action={ActionMore}
				/>
			))}
		</div>
	) : (
		<div className="flex w-full grow flex-col items-center justify-center gap-2">
			<DeadFish className="size-24" />
			<p className="text-xl font-medium">Результаты не найдены.</p>
			<p className="text-base">Попробуйте изменить свой поиск</p>
		</div>
	)
})

export const Content: FC = observer(() => {
	useEffect(() => {
		indexPageStore.fetchAllCards()
	}, [])

	const Component = MapComponent[indexPageStore.statusCards] ?? null
	if (!Component) return null
	return <Component />
})
