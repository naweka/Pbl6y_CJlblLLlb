import * as React from 'react'
import { cn } from '@/shared/lib'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				ref={ref}
				{...props}
			/>
		)
	},
)

Input.displayName = 'Input'

export interface InputGroupProps
	extends React.InputHTMLAttributes<HTMLDivElement> {}

const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
	({ children, className, ...props }, ref) => {
		return (
			<div
				className={cn('relative isolate flex h-10 w-full', className)}
				ref={ref}
				{...props}
			>
				{children}
			</div>
		)
	},
)

InputGroup.displayName = 'InputGroup'

export { Input, InputGroup }
