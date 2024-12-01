import { Plus } from 'lucide-react'
import { FC } from 'react'
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Form, FormSwitcher } from '@/shared/ui'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FIELDS_CARD, formSchemaValidateCard as formSchema } from '../constant';

interface CreateCardButtonProps { }

export const CreateCardButton: FC<CreateCardButtonProps> = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		console.log(payload);
	};

	return (
		<Dialog>
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
							{FIELDS_CARD.map((field) => (
								<FormSwitcher key={field.name} {...field} />
							))}
						</div>
						<DialogFooter>
							<Button className='w-full' type="submit">Создать</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
