import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/lib'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/shared/ui'

export function ModeToggle() {
	const { setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="[&_svg]:size-6" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Сменить тему</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					Светлая
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					Тёмная
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					Систем
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
