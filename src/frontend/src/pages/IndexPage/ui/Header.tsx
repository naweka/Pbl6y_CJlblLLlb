import { FC } from 'react'
import { ComboBox } from '@/entities/ComboBox'
import { Search } from '@/entities/Search'
import { CreateCardButton } from '@/features/CreateCard'
import { Badge, Separator } from '@/shared/ui'

interface HeaderProps {}

const data = [
	{
		label: 'Рыба',
	},
	{
		label: 'Кит',
	},
	{
		label: 'Дельфин',
	},
	{
		label: 'Неизвестный',
	},
	{
		label: 'Неизвестный',
	},
	{
		label: 'Неизвестный',
	},
	{
		label: 'Неизвестный',
	},
	{
		label: 'Неизвестный',
	},
]

export const Header: FC<HeaderProps> = () => {
	return (
		<section className="flex flex-row flex-wrap items-start gap-2 gap-y-4 px-5 md:flex-nowrap">
			<div className="flex w-full flex-wrap gap-2 sm:w-auto md:flex-nowrap">
				<div className="flex w-full gap-2 sm:w-auto">
					<CreateCardButton />
					<Search className="max-w-none sm:max-w-80" />
				</div>
				<ComboBox triggerProps={{ className: 'w-full sm:w-[150px]' }} />
			</div>
			<Separator className="mx-1 hidden h-10 md:block" orientation="vertical" />
			<div className="flex min-h-10 w-full flex-wrap items-center gap-2 md:w-1/2 lg:w-auto">
				{data.map(({ label }, i) => (
					<Badge key={i} className="cursor-pointer">{label}</Badge>
				))}
			</div>
		</section>
	)
}
