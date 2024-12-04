import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Badge, Separator } from "@/shared/ui"
import { observer } from "mobx-react-lite"
import { FC, ReactNode } from "react"
import { detailPageStore } from "../model"

interface HeaderProps { }

const TagsBlock: FC<{ title: string; children: ReactNode }> = ({ title, children }) => {
    return (
        <div>
            <p className="text-lg md:text-xl font-bold">{title}</p>
            <div className="flex min-h-10 w-full flex-wrap items-center gap-2">
                {children}
            </div>
        </div>
    )
}

export const Header: FC<HeaderProps> = observer(() => {
    const { card } = detailPageStore
    return (
        <div className="px-5 last-of-type:space-y-0">
            <div className="w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl mb-5 text-center md:text-left">{card?.title}</h1>
                <Separator />
            </div>
            <div className="flex flex-col md:flex-row items-baseline mt-5 gap-5 gap-y-0">
                {card?.status?.length! > 0 &&
                    <TagsBlock title={"Статус"}>
                        <Badge>{card?.status}</Badge>
                    </TagsBlock>
                }
                {card?.tags?.length! > 0 &&
                    <TagsBlock title={"Теги"}>
                        {card?.tags.map((tag, i) => (
                            <Badge key={tag + i}>{tag}</Badge>
                        ))}
                    </TagsBlock>
                }
            </div>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                    <AccordionTrigger className="text-lg">Описание</AccordionTrigger>
                    <AccordionContent className="text-base">
                        {card?.description}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
})
