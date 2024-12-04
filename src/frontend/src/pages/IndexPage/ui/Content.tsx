import { FC, useEffect } from 'react'
import { Card, CardProps } from '@/entities/Card'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger, Spinner } from '@/shared/ui'
import { EllipsisVertical, ExternalLink } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { STATUS } from '@/shared/types'
import { cardsStore } from '@/entities/Card/model'
import { Link } from 'react-router-dom'

const ActionMore = (props: CardProps) => {
	const { id } = props
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<EllipsisVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-10">
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link className='cursor-pointer' target="_blank" to={ROUTE_CONSTANTS.DETAIL_CARD.TO(id)}>
							<ExternalLink />
							<span>Открыть</span>
						</Link>
					</DropdownMenuItem>
					{/* <DropdownMenuItem>
						<Trash />
						<span>Удалить</span>
					</DropdownMenuItem> */}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>

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
	return <div className={classes}><Spinner /></div>
}

const ContentError = () => {
	return <div className={classes}>Что-то пошло не так...</div>
}

const ContentSuccess = observer(() => {
	return (<div className="grid cursor-pointer gap-5 px-5 auto-fill-80">
		{cardsStore.cards.map((data) => (
			<Card {...data} key={data.id} to={ROUTE_CONSTANTS.DETAIL_CARD.TO(data.id)} action={ActionMore} />
		))}
	</div>)
})

export const Content: FC = observer(() => {
	useEffect(() => {
		cardsStore.fetchAllCards({})
	}, [])
	const Component = MapComponent[cardsStore.status] ?? null
	if (!Component) return null
	return <Component />
})
