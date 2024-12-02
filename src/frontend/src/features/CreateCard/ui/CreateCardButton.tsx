import { Plus } from 'lucide-react'
import { FC, useEffect, useState } from 'react'
import { BaseForm, Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Form, FormSwitcher } from '@/shared/ui'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FIELDS_CARD, formSchemaValidateCard as formSchema } from '../constant';
import { tagsStore } from '@/entities/Tags';
import { observer } from 'mobx-react-lite';
import { sendCreateCard } from '../api';

interface CreateCardButtonProps { }

export const CreateCardButton: FC<CreateCardButtonProps> = observer(() => {
	const [active, setActive] = useState(false)
	const { tags, ...otherField } = FIELDS_CARD
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		await sendCreateCard(payload).then(() => setActive(false))
	};

	useEffect(() => {
		tagsStore.fetchTags()
	}, [])

	return (
		<Dialog open={active} onOpenChange={setActive}>
			<DialogTrigger asChild>
				<Button variant="outline" className="min-w-10" size="icon">
					<Plus />
					<span className="sr-only">Создать карточку</span>
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<Form {...form}>
					<form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
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
							<Button className='w-full' type="submit">Создать</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
})
