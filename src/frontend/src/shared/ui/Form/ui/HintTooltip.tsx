import { HelpCircle } from 'lucide-react'
import type { FC } from 'react'
import type * as TooltipPrimitive from '@radix-ui/react-tooltip'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../Tooltip'

export interface HintTooltipProps
	extends Omit<
		React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
		'children'
	> {
	text: string
}

export const HintTooltip: FC<HintTooltipProps> = ({ text, ...props }) => {
	return (
		<TooltipProvider delayDuration={0} {...props}>
			<Tooltip>
				<TooltipTrigger className="align-text-bottom">
					<HelpCircle className="size-4" />
				</TooltipTrigger>
				<TooltipContent className="max-w-xs">
					<p>{text}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
