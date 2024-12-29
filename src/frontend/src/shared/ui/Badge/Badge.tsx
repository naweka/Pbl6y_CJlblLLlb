import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib'

const badgeVariants = cva(
	'inline-flex items-center cursor-default text rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				outline: 'text-foreground',
			},
			size: {
				default: 'px-2.5 py-0.5 text-xs',
				sm: 'px-4 py-1 text-sm',
				lg: 'px-5 py-1 text-lg',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	},
)

//TODO Сделать адаптивные expand-responsive https://github.com/chakra-ui/chakra-ui/blob/v2/packages/styled-system/src/utils/expand-responsive.ts

interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

const Badge = ({ className, variant, size, ...props }: BadgeProps) => {
	return (
		<div
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	)
}

export { Badge, badgeVariants }
export type { BadgeProps }
