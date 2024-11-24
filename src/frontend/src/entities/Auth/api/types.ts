export interface ApiPostLogin {
	token: string
}

export interface ApiPostSignUp {
	login: string
	password: string
	fullname: string
	token: string
}

export interface SendLoginData {
	login: string
	password: string
}

export interface SignUpData {
	login: string
	password: string
	fullname: string
}
