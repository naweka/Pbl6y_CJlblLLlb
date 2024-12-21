import { X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { Search } from '@/entities/Search'
import { CreateCardButton } from '@/features/CreateCard'
import { cn } from '@/shared/lib'
import { Badge, Separator } from '@/shared/ui'
import { indexPageStore } from '../model'

interface HeaderProps {}

export const Header: FC<HeaderProps> = observer(() => {
	useEffect(() => {
		indexPageStore.fetchAllTags()
	}, [])

	return (
		<section className="flex flex-row flex-wrap items-start gap-2 px-5 md:flex-nowrap">
			<div className="flex w-full flex-wrap gap-2 sm:w-auto md:flex-nowrap">
				<div className="flex w-full gap-2 sm:w-auto">
					<CreateCardButton action={indexPageStore.fetchAllCards} />
					<Search
						className="max-w-none sm:max-w-80"
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
				<div className="flex min-h-10 w-full flex-wrap items-center gap-2 md:w-1/2 lg:w-auto">
					{indexPageStore.tagsWithActive.map(({ title, active }) => {
						return (
							<Badge
								key={title}
								size="sm"
								variant={active ? 'default' : 'outline'}
								onClick={() => indexPageStore.setActiveTags(title)}
								className={cn(
									'cursor-pointer select-none gap-1',
									active ? 'pr-1' : '',
								)}
							>
								{title}
								{active && <X className="h-4 w-4" />}
							</Badge>
						)
					})}
				</div>
			)}
		</section>
	)
})
