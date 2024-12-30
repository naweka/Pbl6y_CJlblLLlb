import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { Search } from '@/entities/Search'
import { Tags } from '@/entities/Tags'
import { CreateCardButton } from '@/features/CreateCard'
import { Separator } from '@/shared/ui'
import { indexPageStore } from '../model'

interface HeaderProps { }

export const Header: FC<HeaderProps> = observer(() => {
	useEffect(() => {
		indexPageStore.fetchAllTags()
	}, [])

	return (
		<section className="flex flex-row flex-wrap items-start gap-2 px-5 md:flex-nowrap">
			<div className="flex w-full flex-wrap gap-2 md:w-80 md:flex-nowrap">
				<div className="flex w-full gap-2">
					<CreateCardButton
						action={() => {
							indexPageStore.fetchAllCards()
							indexPageStore.fetchAllTags()
						}}
					/>
					<Search
						className="max-w-none md:max-w-80 w-full"
						onActon={indexPageStore.fetchAllCards}
						inputProps={{
							onChange: indexPageStore.setSearch,
							value: indexPageStore.search,
						}}
					/>
				</div>
			</div>
			<Separator className="mx-1 hidden h-10 md:block" orientation="vertical" />
			{indexPageStore.tags.length > 0 && (
				<div className="flex min-h-10 w-full flex-wrap items-center gap-2 lg:w-auto">
					{indexPageStore.tagsWithActive.map(({ title, active }) => {
						return (
							<Tags
								key={title}
								active={active}
								size="sm"
								onClick={() => indexPageStore.setActiveTags(title)}
							>
								{title}
							</Tags>
						)
					})}
				</div>
			)}
		</section>
	)
})
