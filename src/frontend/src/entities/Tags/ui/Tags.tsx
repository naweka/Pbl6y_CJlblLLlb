import { X } from 'lucide-react'
import { FC } from 'react'
import { cn } from '@/shared/lib'
import { Badge, BadgeProps } from '@/shared/ui'

export interface TagsProps extends BadgeProps {
	active?: boolean
}

export const Tags: FC<TagsProps> = ({ active, children, ...props }) => {
	return (
		<Badge
			variant={active ? 'default' : 'outline'}
			className={cn('cursor-pointer select-none gap-1', active ? 'pr-1' : '')}
			{...props}
		>
			{children}
			{active && (
				<X className="h-4 w-4 rounded-full bg-background p-[2px] text-foreground" />
			)}
		</Badge>
	)
}
