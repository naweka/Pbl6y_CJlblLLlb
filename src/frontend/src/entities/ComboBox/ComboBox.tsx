import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/shared/lib'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shared/ui'
import { Button, ButtonProps } from '@/shared/ui/Button'
import * as PopoverPrimitive from '@radix-ui/react-popover'

const data = [
	{
		value: 'fish',
		label: 'Рыба',
	},
	{
		value: 'kit',
		label: 'Кит',
	},
	{
		value: 'dolphin',
		label: 'Дельфин',
	},
	{
		value: 'unknown',
		label: 'Неизвестный',
	},
]

interface ComboBoxProps
	extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>,
		Omit<Partial<HTMLElement>, 'children'> {
	triggerProps?: ButtonProps
}

export const ComboBox: React.FC<ComboBoxProps> = ({
	className,
	triggerProps,
	...props
}) => {
	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState('')

	return (
		<Popover open={open} onOpenChange={setOpen} {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					{...triggerProps}
					className={cn('w-[150px] justify-between', triggerProps?.className)}
				>
					{value
						? data.find((framework) => framework.value === value)?.label
						: 'Выбрать тег'}
					<ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[150px] p-0">
				<Command>
					<CommandInput placeholder="Поиск тегов" />
					<CommandList>
						<CommandEmpty>Не удалось найти.</CommandEmpty>
						<CommandGroup>
							{data.map((framework) => (
								<CommandItem
									key={framework.value}
									value={framework.value}
									onSelect={(currentValue) => {
										setValue(currentValue === value ? '' : currentValue)
										setOpen(false)
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											value === framework.value ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{framework.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
