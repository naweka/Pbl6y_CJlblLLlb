import { EditableCancelTrigger } from "@/shared/ui/Editable/EditableCancelTrigger"
import { EditableControl } from "@/shared/ui/Editable/EditableControl"
import { EditableEditTrigger } from "@/shared/ui/Editable/EditableEditTrigger"
import { EditableInput } from "@/shared/ui/Editable/EditableInput"
import { EditablePreview } from "@/shared/ui/Editable/EditablePreview"
import { EditableRoot } from "@/shared/ui/Editable/EditableRoot"
import { EditableSubmitTrigger } from "@/shared/ui/Editable/EditableSubmitTrigger"
import { LucideCheck, LucidePencilLine, LucideX } from "lucide-react"
import { FC } from "react"

interface InputHeaderProps { }

export const InputHeader: FC<InputHeaderProps> = () => {
    return (
        <EditableRoot defaultValue="Click to edit">
            <EditablePreview />
            <EditableInput />
            <EditableControl>
                <EditableEditTrigger asChild>
                    <LucidePencilLine />
                </EditableEditTrigger>
                <EditableCancelTrigger asChild>
                    <LucideX />
                </EditableCancelTrigger>
                <EditableSubmitTrigger asChild>
                    <LucideCheck />
                </EditableSubmitTrigger>
            </EditableControl>
        </EditableRoot>
    )
}
