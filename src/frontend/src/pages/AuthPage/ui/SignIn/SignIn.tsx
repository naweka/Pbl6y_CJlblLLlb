import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { authStore } from '@/entities/Auth'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Form,
	FormSwitcher,
} from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	AuthTogglers,
	FIELDS_SIGN_IN,
	formSchemaValidateSignIn as formSchema,
} from '../../authConstants'

interface SignInProps {
	setActive: React.Dispatch<React.SetStateAction<AuthTogglers>>
}

export const SignIn: FC<SignInProps> = observer(({ setActive }) => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (payload: z.infer<typeof formSchema>) => {
		await authStore.login(payload)
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Войти</CardTitle>
				<CardDescription>
					Введите свой логин ниже, чтобы войти в свою учетную запись.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{FIELDS_SIGN_IN.map((field) => (
							<FormSwitcher key={field.name} {...field} />
						))}
						<Button
							type="submit"
							loading={form.formState.isSubmitting}
							className="w-full"
						>
							Войти
						</Button>
					</form>
				</Form>
				<div className="mt-4 text-center text-sm">
					У вас нет учетной записи?{' '}
					<Button
						variant="link"
						onClick={() => setActive(AuthTogglers.SIGN_UP)}
						className="h-4 p-0"
					>
						Зарегистрироваться
					</Button>
				</div>
			</CardContent>
		</Card>
	)
})
