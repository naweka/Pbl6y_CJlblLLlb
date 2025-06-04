import { LogOut, User } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStore } from '@/entities/Auth'
import { ROUTE_CONSTANTS } from '@/shared/config'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/ui'

interface ProfileUserButtonProps {}

export const ProfileUserButton: FC<ProfileUserButtonProps> = observer(() => {
	const navigate = useNavigate()

	if (!authStore.isAuth) {
		return (
			<Button
				variant="ghost"
				onClick={() => navigate(ROUTE_CONSTANTS.AUTH.URL)}
				className="[&_svg]:size-6"
				size="icon"
			>
				<User />
			</Button>
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="[&_svg]:size-6" size="icon">
					<User />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => navigate(ROUTE_CONSTANTS.USER_PAGE.URL)}
				>
					<User />
					<span>Профиль</span>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => authStore.logout()}>
					<LogOut />
					<span>Выйти</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
})
