import { ModeToggle } from "@/features/ModeToggle";
import { ProfileUserButton } from "@/features/ProfileUser";
import { ROUTE_CONSTANTS } from "@/shared/config";
import { Logo } from "@/shared/ui";
import { FC } from "react";
import { Link } from "react-router-dom";

interface HeaderProps { }

export const Header: FC<HeaderProps> = () => {
	return (
		<header className="h-header border border-t-0 flex justify-center items-center rounded-b-md">
			<div className="flex justify-between max-w-layout w-full px-5 py-2">
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
	);
};
