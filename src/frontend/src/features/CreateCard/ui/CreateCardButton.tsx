import { Button } from "@/shared/ui"
import { Plus } from "lucide-react"
import { FC } from "react"

interface CreateCardButtonProps { }

export const CreateCardButton: FC<CreateCardButtonProps> = () => {
    return (
        <Button variant="outline" className="min-w-10" size="icon">
            <Plus />
            <span className="sr-only">Создать карточку</span>
        </Button>
    )
}
