import { Badge, Separator } from "@/shared/ui"
import { FC } from "react"

interface HeaderProps { }

const data = [
    {
        label: 'Рыба',
    },
    {
        label: 'Кит',
    },
    {
        label: 'Дельфин',
    },
    {
        label: 'Неизвестный',
    },
]

export const Header: FC<HeaderProps> = () => {
    return (
        <div className="space-y-5 px-5">
            <div className="w-full sm:w-fit">
                <h1 className="text-3xl sm:text-4xl md:text-5xl mb-5 text-center">Имя карточки большое очень</h1>
                <Separator />
            </div>
            <div className="flex min-h-10 w-full flex-wrap items-center gap-2">
                {data.map(({ label }, i) => (
                    <Badge key={i} className="cursor-pointer">{label}</Badge>
                ))}
            </div>
        </div>
    )
}
