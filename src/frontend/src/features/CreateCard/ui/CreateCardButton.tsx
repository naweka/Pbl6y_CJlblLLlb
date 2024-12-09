import { Plus } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { sendCreateCard } from '@/entities/Card'
import { tagsStore } from '@/entities/Tags'
import { STATUS } from '@/shared/types'
import {
	BaseForm,
	Button,
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Form,
	FormSwitcher,
	Spinner,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { FIELDS_CARD, formSchemaValidateCard as formSchema } from '../constant'

interface CreateCardButtonProps {
	action?: () => void
}

interface CreateCardProps extends CreateCardButtonProps {
	setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const MapComponent: Record<STATUS, FC<CreateCardProps>> = {
	[STATUS.INITIAL]: (props) => <CreateCardLoading {...props} />,
	[STATUS.LOADING]: (props) => <CreateCardLoading {...props} />,
	[STATUS.SUCCESS]: (props) => <CreateCardSuccess {...props} />,
	[STATUS.ERROR]: (props) => <CreateCardError {...props} />,
}

const CreateCardError: FC<CreateCardProps> = () => {
	return (
		<div className="flex items-center justify-center">
			Что-то пошло не так...
		</div>
	)
}

const CreateCardLoading: FC<CreateCardProps> = () => {
	return (
		<div className="flex w-full items-center justify-center">
			<Spinner />
		</div>
	)
}

const CreateCardSuccess: FC<CreateCardProps> = observer(
	({ setActive, action }) => {
		const { tags, ...otherField } = FIELDS_CARD
		const form = useForm<z.infer<typeof formSchema>>({
			resolver: zodResolver(formSchema),
		})

		const onSubmit = async (payload: z.infer<typeof formSchema>) => {
			await sendCreateCard(payload).then(() => {
				setActive(false)
				action?.()
			})
		}

		return (
			<Form {...form}>
				<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Создание карточки</DialogTitle>
					</DialogHeader>
					<div onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{Object.values(otherField).map((field) => (
							<FormSwitcher key={field.name} {...field} />
						))}
						<BaseForm.BaseFieldMultiSelect options={tagsStore.tags} {...tags} />
					</div>
					<DialogFooter>
						<Button className="w-full" type="submit">
							Создать
						</Button>
					</DialogFooter>
				</form>
			</Form>
		)
	},
)

export const CreateCardButton: FC<CreateCardButtonProps> = observer(
	({ action }) => {
		const [active, setActive] = useState(false)

		useEffect(() => {
			if (active) {
				tagsStore.fetchTags()
			}
		}, [active])

		const Component = MapComponent[tagsStore.status] ?? null

		return (
			<Dialog open={active} onOpenChange={setActive}>
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<DialogTrigger asChild>
								<Button variant="outline" className="min-w-10" size="icon">
									<Plus />
									<span className="sr-only">Создать карточку</span>
								</Button>
							</DialogTrigger>
						</TooltipTrigger>
						<TooltipContent>
							<p>Создать карточку</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<DialogContent className="min-h-40 sm:max-w-[425px]">
					{Component && <Component setActive={setActive} action={action} />}
				</DialogContent>
			</Dialog>
		)
	},
)
