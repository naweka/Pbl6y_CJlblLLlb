import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/shared/lib'
import * as LabelPrimitive from '@radix-ui/react-label'

const labelVariants = cva(
	'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

interface LabelProps
	extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
		VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	LabelProps
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(labelVariants(), className)}
		{...props}
	/>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants }
export type { LabelProps }
