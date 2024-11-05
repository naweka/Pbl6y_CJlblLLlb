import { EllipsisVertical } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	CardContent,
	CardFooter,
	CardHeader,
	Card as CardUI,
} from '@/shared/ui'

interface CardProps {
	title: string
	avatarFallback: string
	description?: string
	avatarUrl?: string
}

export const Card: FC<CardProps> = ({
	title,
	description,
	avatarFallback,
	avatarUrl,
}) => {
	return (
		<Link to="/" className="contents">
			<CardUI className="flex flex-row transition-transform hover:scale-[1.01]">
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
				<CardFooter className="pb-0 pr-2">
					<Button size="icon" variant="ghost">
						<EllipsisVertical />
					</Button>
				</CardFooter>
			</CardUI>
		</Link>
	)
}
