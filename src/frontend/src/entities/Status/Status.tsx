import { FC } from 'react'
import { STATUS, STATUS_KEY } from '@/shared/config'
import { cn } from '@/shared/lib'
import { Badge, BadgeProps } from '@/shared/ui'

export interface StatusProps extends BadgeProps {
	status: STATUS_KEY
}

export const Status: FC<StatusProps> = ({ status, className, ...props }) => {
	const item = STATUS[status] || {
		color: 'bg-primary',
		title: status,
	}
	return (
		<Badge
			className={cn(item.color, `font-bold hover:${item.color}`, className)}
			{...props}
		>
			{item.title}
		</Badge>
	)
}
