import { FC, Fragment, ReactNode } from 'react'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	CardContent,
	CardFooter,
	CardHeader,
	Card as CardUI,
} from '@/shared/ui'
import { Link, To } from 'react-router-dom'
import { isEmpty } from '@/shared/lib'

interface CardProps {
	title: string
	avatarFallback: string
	description?: string
	avatarUrl?: string
	action?: ReactNode
	to?: To
}

export const Card: FC<CardProps> = ({
	title,
	description,
	avatarFallback,
	avatarUrl,
	action,
	to,
}) => {
	const IsLink = isEmpty(to) ? Fragment : Link
	return (
		<CardUI className="flex flex-row transition-transform hover:scale-[1.01]">
			<IsLink className="contents" to={to!}>
				<CardHeader className="pr-0">
					<Avatar>
						<AvatarImage src={avatarUrl} alt={avatarFallback} />
						<AvatarFallback>{avatarFallback}</AvatarFallback>
					</Avatar>
				</CardHeader>
				<CardContent className="flex w-full flex-col justify-center pb-0">
					<p>{title}</p>
					<p>{description}</p>
				</CardContent>
			</IsLink>
			<CardFooter className="pb-0 pr-2">
				{action}
			</CardFooter>
		</CardUI>
	)
}
