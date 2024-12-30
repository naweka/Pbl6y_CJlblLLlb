import { X } from 'lucide-react'
import { FC } from 'react'
import {
	Button,
	ButtonProps,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'

interface DeleteFileProps extends ButtonProps {}

export const DeleteFile: FC<DeleteFileProps> = ({ ...props }) => {
	return (
		<TooltipProvider delayDuration={0}>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="destructive"
						className="min-w-10"
						size="icon"
						{...props}
					>
						<X />
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<p>Удалить файл.</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
