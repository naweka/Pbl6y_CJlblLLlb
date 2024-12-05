import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { MultiSelect } from '@/entities/MultiSelect'
import { Search } from '@/entities/Search'
import { CreateCardButton } from '@/features/CreateCard'
import { Badge, Separator } from '@/shared/ui'
import { indexPageStore } from '../model'

interface HeaderProps {}

export const Header: FC<HeaderProps> = observer(() => {
	useEffect(() => {
		indexPageStore.fetchAllTags()
	}, [])

	return (
		<section className="flex flex-row flex-wrap items-start gap-2 gap-y-0 px-5 md:flex-nowrap">
			<div className="flex w-full flex-wrap gap-2 sm:w-auto md:flex-nowrap">
				<div className="flex w-full gap-2 sm:w-auto">
					<CreateCardButton action={indexPageStore.fetchAllCards} />
					<Search
						className="max-w-none sm:max-w-80"
						onClick={indexPageStore.fetchAllCards}
						inputProps={{
							onChange: indexPageStore.setSearch,
							value: indexPageStore.search,
						}}
					/>
				</div>
				<MultiSelect
					className="w-full sm:w-[150px]"
					options={indexPageStore.tags}
					values={indexPageStore.activeTags}
					onValuesChange={indexPageStore.setActiveTags}
				/>
			</div>
			{indexPageStore.activeTags.length > 0 && (
				<>
					<Separator
						className="mx-1 hidden h-10 md:block"
						orientation="vertical"
					/>
					<div className="flex min-h-10 w-full flex-wrap items-center gap-2 md:w-1/2 lg:w-auto">
						{indexPageStore.activeTags.map((string, i) => (
							<Badge key={i} className="cursor-pointer">
								{string}
							</Badge>
						))}
					</div>
				</>
			)}
		</section>
	)
})
