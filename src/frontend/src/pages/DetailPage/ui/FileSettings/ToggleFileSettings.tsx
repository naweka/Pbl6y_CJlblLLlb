import { SlidersHorizontal } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import type { FC } from 'react'
import {
	Toggle,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'
import { detailPageStore } from '../../model'

interface ToggleFileSettingsProps {
	fileId: string
	disabled?: boolean
}

export const ToggleFileSettings: FC<ToggleFileSettingsProps> = observer(
	({ fileId, disabled }) => {
		return (
			<TooltipProvider delayDuration={0}>
				<Tooltip>
					<TooltipTrigger asChild>
						<Toggle
							disabled={disabled}
							data-state={
								detailPageStore.getToggleSetting(fileId) ? 'on' : 'off'
							}
							onPressedChange={(value) =>
								detailPageStore.setToggleSettings(fileId, value)
							}
							variant="outline"
							className="min-w-10"
							size="icon"
						>
							<SlidersHorizontal />
						</Toggle>
					</TooltipTrigger>
					<TooltipContent>
						<p>
							{detailPageStore.getToggleSetting(fileId)
								? 'Выключить настройки файла.'
								: 'Включить настройки файла.'}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	},
)
