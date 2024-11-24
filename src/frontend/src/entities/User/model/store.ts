import { makeAutoObservable, runInAction } from 'mobx'
import { STATUS } from '@/shared/types'
import { getCurrentUser } from '../api'
import { User } from '../types'
import { IUserStore } from './types'

class UserStore implements IUserStore {
	private _currentUser: User | null = null
	private _status = STATUS.INITIAL

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	get currentUser() {
		return this._currentUser
	}

	get status() {
		return this._status
	}

	async fetchCurrentUser() {
		this._status = STATUS.LOADING
		try {
			const res = await getCurrentUser()
			runInAction(() => {
				this._currentUser = res?.data ?? null
				this._status = STATUS.SUCCESS
			})
		} catch (error) {
			console.error()
			this._status = STATUS.ERROR
		}
	}
}

export default new UserStore()
