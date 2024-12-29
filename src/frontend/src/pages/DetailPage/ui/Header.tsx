import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'
import { Status } from '@/entities/Status'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Badge,
	Separator,
} from '@/shared/ui'
import { detailPageStore } from '../model'
import { Edit } from './Edit'

interface HeaderProps { }

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
		<div className="px-5">
			<div className="w-full">
				<div className="flex flex-col-reverse items-center justify-between gap-3 md:flex-row">
					{/* <InputHeader /> */}
					<h1 className="mb-5 text-center text-3xl sm:text-4xl md:text-left md:text-5xl">
						{card?.title}
					</h1>
					<Edit />
				</div>
				<Separator />
			</div>
			<div className="mt-2 flex flex-col items-baseline gap-5 gap-y-0 md:flex-row">
				{card?.status && card?.status?.length > 0 && (
					<TagsBlock title={'Статус'}>
						<Status status={card?.status} />
					</TagsBlock>
				)}
				{card?.tags?.length! > 0 && (
					<TagsBlock title={'Теги'}>
						{card?.tags.map((tag, i) => (
							<Badge className="font-bold uppercase" key={tag + i}>
								{tag}
							</Badge>
						))}
					</TagsBlock>
				)}
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="description">
					<AccordionTrigger className="justify-start gap-2 text-lg [&_svg]:mt-1">
						Описание
					</AccordionTrigger>
					<AccordionContent className="text-base">
						{card?.description}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
})
