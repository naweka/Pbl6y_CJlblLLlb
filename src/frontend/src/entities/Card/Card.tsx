import { Avatar, AvatarFallback, AvatarImage, Button, CardContent, CardFooter, CardHeader } from "@/shared/ui"
import { Card as CardUI } from "@/shared/ui"
import { EllipsisVertical } from "lucide-react"
import { FC } from "react"
import { Link } from "react-router-dom"

interface CardProps {
    title: string
    avatarFallback: string
    description?: string
    avatarUrl?: string
}

export const Card: FC<CardProps> = ({ title, description, avatarFallback, avatarUrl }) => {
    return (
        <Link to='/' className="contents">
            <CardUI className="flex flex-row hover:scale-[1.01] transition-transform">
                <CardHeader className="pr-0">
                    <Avatar>
                        <AvatarImage src={avatarUrl} alt={avatarFallback} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                </CardHeader>
                <CardContent className="flex flex-col justify-center w-full pb-0">
                    <p>{title}</p>
                    <p>{description}</p>
                </CardContent>
                <CardFooter className="pb-0 pr-2">
                    <Button size="icon" variant="ghost"><EllipsisVertical /></Button>
                </CardFooter>
            </CardUI>
        </Link>
    )
}
