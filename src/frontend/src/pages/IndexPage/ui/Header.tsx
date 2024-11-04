import { ComboBox } from "@/entities/ComboBox"
import { Search } from "@/entities/Search"
import { CreateCardButton } from "@/features/CreateCard"
import { Badge, Separator } from "@/shared/ui"
import { FC } from "react"

interface HeaderProps { }

const data = [
    {
        label: "Рыба",
    },
    {
        label: "Кит",
    },
    {
        label: "Дельфин",
    },
    {
        label: "Неизвестный",
    },
    {
        label: "Неизвестный",
    },
    {
        label: "Неизвестный",
    },
    {
        label: "Неизвестный",
    },
    {
        label: "Неизвестный",
    },
]

export const Header: FC<HeaderProps> = () => {
    return (
        <section className="flex flex-row gap-2 gap-y-4 px-5 items-start flex-wrap md:flex-nowrap">
            <div className="flex gap-2 flex-wrap md:flex-nowrap w-full sm:w-auto">
                <div className="flex gap-2 w-full sm:w-auto">
                    <CreateCardButton />
                    <Search className="max-w-none sm:max-w-80" />
                </div>
                <ComboBox triggerProps={{ className: "w-full sm:w-[150px]" }} />
            </div>
            <Separator className="hidden h-10 mx-1 md:block" orientation="vertical" />
            <div className="flex gap-2 flex-wrap items-center min-h-10 w-full md:w-1/2 lg:w-auto">
                {data.map(({ label }, i) => (
                    <Badge key={i}>{label}</Badge>
                ))}
            </div>
        </section>
    )
}
