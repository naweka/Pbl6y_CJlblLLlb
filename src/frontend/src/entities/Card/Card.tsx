import React, { FC, Fragment } from 'react'
import { Link, To } from 'react-router-dom'
import { firstChar, isEmpty } from '@/shared/lib'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	CardContent,
	CardFooter,
	CardHeader,
	Card as CardUI,
} from '@/shared/ui'
import type { Card as ICard } from './types'

export interface CardProps extends ICard {
	to?: To
	action: (props: CardProps) => JSX.Element
}

export const Card: FC<CardProps> = (props) => {
	const {
		title,
		description,
		// avatarFallback,
		// avatarUrl,
		action,
		to,
	} = props
	const IsLink = isEmpty(to) ? Fragment : Link
	return (
		<CardUI className="flex flex-row transition-transform hover:scale-[1.01]">
			<IsLink className="contents" to={to!}>
				<CardHeader className="pr-0">
					<Avatar>
						<AvatarImage alt={title} />
						<AvatarFallback>{firstChar(title)}</AvatarFallback>
					</Avatar>
				</CardHeader>
				<CardContent className="flex w-full flex-col justify-center pb-0">
					<p>{title}</p>
					<p>{description}</p>
				</CardContent>
			</IsLink>
			<CardFooter className="pb-0 pr-2">
				{action && React.isValidElement(action)
					? action
					: React.createElement(action, props)}
			</CardFooter>
		</CardUI>
	)
}
