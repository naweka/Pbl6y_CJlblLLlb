import { observer } from 'mobx-react-lite'
import { FC, ReactNode } from 'react'
import { Edit } from '@/entities/Edit'
import { Status } from '@/entities/Status'
import { Tags } from '@/entities/Tags'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Separator,
} from '@/shared/ui'
import { detailPageStore } from '../model'
import { DescriptionEditable } from './DescriptionEditable'
import { HeaderEditable } from './HeaderEditable'

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
		<div className="px-5">
			<div className="w-full">
				<div className="flex flex-col-reverse items-end justify-between gap-3 md:flex-row md:items-center">
					<HeaderEditable />
					<Edit
						checked={detailPageStore.edit}
						// eslint-disable-next-line @typescript-eslint/unbound-method
						onCheckedChange={detailPageStore.setEdit}
					/>
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
							<Tags
								variant="default"
								className="font-bold uppercase"
								key={tag + i}
							>
								{tag}
							</Tags>
						))}
					</TagsBlock>
				)}
			</div>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="description">
					<AccordionTrigger className="justify-start gap-2 text-lg [&_svg]:mt-1">
						Описание
					</AccordionTrigger>
					<AccordionContent className="mb-2 p-1 text-base">
						<DescriptionEditable />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	)
})
