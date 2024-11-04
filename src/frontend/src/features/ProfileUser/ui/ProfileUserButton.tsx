import { Button } from "@/shared/ui"
import { User } from "lucide-react"
import { FC } from "react"

interface ProfileUserButtonProps { }

export const ProfileUserButton: FC<ProfileUserButtonProps> = () => {
    return (
        <Button variant="ghost" className="[&_svg]:size-6" size="icon">
            <User />
            <span className="sr-only">Профиль</span>
        </Button>
    )
}
