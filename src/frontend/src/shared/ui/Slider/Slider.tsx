import * as React from 'react'
import { cn } from '@/shared/lib'
import * as SliderPrimitive from '@radix-ui/react-slider'

export interface SliderProps
	extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
	labelTbumb?: (value: number | undefined) => React.ReactNode
	labelPosition?: 'top' | 'bottom'
}

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	SliderProps
>(
	(
		{
			className,
			value,
			labelTbumb = (value) => value,
			labelPosition = 'top',
			...props
		},
		ref,
	) => {
		const initialValue = value?.[0] ? value : [props.min]
		return (
			<SliderPrimitive.Root
				ref={ref}
				className={cn(
					'relative flex w-full touch-none select-none items-center py-2',
					labelPosition === 'top' && 'pt-7',
					labelPosition === 'bottom' && 'pb-4',
					className,
				)}
				defaultValue={value}
				value={value}
				{...props}
			>
				<SliderPrimitive.Track className="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-secondary">
					<SliderPrimitive.Range className="absolute h-full bg-primary" />
				</SliderPrimitive.Track>
				{initialValue.map((value, index) => (
					<React.Fragment key={index}>
						<SliderPrimitive.Thumb className="relative block h-4 w-4 cursor-pointer rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
							{labelTbumb && (
								<span
									className={cn(
										'absolute flex w-full justify-center font-medium',
										labelPosition === 'top' && '-top-7',
										labelPosition === 'bottom' && 'top-4',
									)}
								>
									{labelTbumb(value)}
								</span>
							)}
						</SliderPrimitive.Thumb>
					</React.Fragment>
				))}
			</SliderPrimitive.Root>
		)
	},
)

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
