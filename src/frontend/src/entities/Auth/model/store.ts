import { makeAutoObservable, runInAction } from 'mobx'
import { config } from '@/shared/config'
import { ls } from '@/shared/lib'
import { STATUS } from '@/shared/types'
import { sendLogin, SendLoginData, sendSignUp, SignUpData } from '../api'
import { IAuthStore } from './types'

class AuthStore implements IAuthStore {
	private _isAuth = false
	private _status = STATUS.INITIAL

	constructor() {
		this.checkAuth()
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get isAuth() {
		return this._isAuth
	}

	get status() {
		return this._status
	}

	getToken() {
		return localStorage.getItem(config.tokenKeyLS)
	}

	setToken(token: string) {
		localStorage.setItem(config.tokenKeyLS, token)
	}

	async login(data: SendLoginData) {
		try {
			const res = await sendLogin(data)
			const token = res?.data.token
			if (token) {
				this.setToken(token)
			}
			this._isAuth = true
		} catch (error) {
			console.error(error)
		}
	}

	async signUp(data: SignUpData) {
		try {
			const res = await sendSignUp(data)
			const token = res?.data.token
			if (token) {
				this.setToken(token)
			}
			this._isAuth = true
		} catch (error) {
			console.error(error)
		}
	}

	async checkAuth() {
		this._status = STATUS.LOADING
		try {
			const token = this.getToken()
			// Задержка Убрать
			await new Promise((resolve) => setTimeout(resolve, 1000))
			runInAction(() => {
				if (token) {
					this._isAuth = true
				} else {
					this._isAuth = false
				}
				this._status = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._status = STATUS.ERROR
			this._isAuth = false
		}
	}

	async logout() {
		try {
			ls.deleteItem(config.tokenKeyLS)
			this._isAuth = false
		} catch (error) {
			console.error(error)
		}
	}
}

export default new AuthStore()
