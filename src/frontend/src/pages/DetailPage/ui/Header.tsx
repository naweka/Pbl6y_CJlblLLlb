import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Badge,
	Separator,
} from '@/shared/ui'
import { detailPageStore } from '../model'

interface HeaderProps {}

const TagsBlock: FC<{ title: string; children: ReactNode }> = ({
	title,
	children,
}) => {
	return (
		<div>
			<p className="text-lg font-bold md:text-xl">{title}</p>
			<div className="flex min-h-10 w-full flex-wrap items-center gap-2">
				{children}
			</div>
		</div>
	)
}

export const Header: FC<HeaderProps> = observer(() => {
	const { card } = detailPageStore
	return (
		<div className="px-5 last-of-type:space-y-0">
			<div className="w-full">
				<h1 className="mb-5 text-center text-3xl sm:text-4xl md:text-left md:text-5xl">
					{card?.title}
				</h1>
				<Separator />
			</div>
			<div className="mt-5 flex flex-col items-baseline gap-5 gap-y-0 md:flex-row">
				{card?.status?.length! > 0 && (
					<TagsBlock title={'Статус'}>
						<Badge>{card?.status}</Badge>
					</TagsBlock>
				)}
				{card?.tags?.length! > 0 && (
					<TagsBlock title={'Теги'}>
						{card?.tags.map((tag, i) => <Badge key={tag + i}>{tag}</Badge>)}
					</TagsBlock>
				)}
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="description">
					<AccordionTrigger className="text-lg">Описание</AccordionTrigger>
					<AccordionContent className="text-base">
						{card?.description}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
})
