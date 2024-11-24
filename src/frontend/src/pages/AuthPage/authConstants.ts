import { z } from 'zod'
import { FieldTypes, FormSwitcherProps } from '@/shared/ui/Form'

export enum AuthTogglers {
	SIGN_IN = 'SignIn',
	SIGN_UP = 'SignUp',
}

export const FIELDS_SIGN_IN: FormSwitcherProps[] = [
	{
		name: 'login',
		component: FieldTypes.Input,
		label: 'Логин',
	},
	{
		name: 'password',
		component: FieldTypes.Input,
		label: 'Пароль',
		type: 'password',
	},
]

export const FIELDS_SIGN_UP: FormSwitcherProps[] = [
	{
		name: 'fullname',
		component: FieldTypes.Input,
		label: 'ФИО',
	},
	{
		name: 'login',
		component: FieldTypes.Input,
		label: 'Логин',
	},
	{
		name: 'password',
		component: FieldTypes.Input,
		label: 'Пароль',
		type: 'password',
	},
]

const loginField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const passwordField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

const fullnameField = z
	.string()
	.min(1, { message: 'Данное поле является обязательным для заполнения!' })

export const formSchemaValidateSignUp = z.object({
	login: loginField,
	password: passwordField,
	fullname: fullnameField,
})

export const formSchemaValidateSignIn = z.object({
	login: loginField,
	password: passwordField,
})
