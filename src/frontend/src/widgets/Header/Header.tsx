import { FC } from 'react'
import { Link } from 'react-router-dom'
import { ModeToggle } from '@/features/ModeToggle'
import { ProfileUserButton } from '@/features/ProfileUser'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Logo } from '@/shared/ui'

interface HeaderProps {}

export const Header: FC<HeaderProps> = () => {
	return (
		<header className="flex h-header items-center justify-center rounded-b-md border border-t-0">
			<div className="flex w-full max-w-layout justify-between px-5 py-2">
				<div>
					<Link to={ROUTE_CONSTANTS.INDEX}>
						<Logo className="h-16 w-28 text-foreground" />
					</Link>
				</div>
				<div className="flex items-center">
					<ModeToggle />
					<ProfileUserButton />
				</div>
			</div>
		</header>
	)
}
