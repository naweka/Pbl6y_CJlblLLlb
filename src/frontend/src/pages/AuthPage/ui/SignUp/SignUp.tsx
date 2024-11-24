import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormSwitcher } from '@/shared/ui'
import { FC } from 'react'
import { AuthTogglers, FIELDS_SIGN_UP, formSchemaValidateSignUp as formSchema } from '../../authConstants'
import { useForm } from 'react-hook-form'
import type { z } from "zod"
import { authStore } from '@/entities/Auth'
import { observer } from 'mobx-react-lite'

interface SignUpProps {
    setActive: React.Dispatch<React.SetStateAction<AuthTogglers>>
}

export const SignUp: FC<SignUpProps> = observer(({ setActive }) => {
    const form = useForm<z.infer<typeof formSchema>>();

    const onSubmit = async (payload: z.infer<typeof formSchema>) => {
        await authStore.signUp(payload)
    };

    return (
        <Card className="max-w-sm w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Зарегистрироваться</CardTitle>
                <CardDescription>
                    Введите свой логин ниже, чтобы создать учетную запись.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {FIELDS_SIGN_UP.map((field) => (
                            <FormSwitcher key={field.name} {...field} />
                        ))}
                        <Button type="submit" loading={form.formState.isSubmitting} className="w-full">
                            Зарегистрироваться
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    <Button variant="link" onClick={() => setActive(AuthTogglers.SIGN_IN)} className="p-0 h-4">
                        Войти
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
})
