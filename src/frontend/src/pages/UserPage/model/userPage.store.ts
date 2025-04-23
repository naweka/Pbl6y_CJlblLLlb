import { makeAutoObservable } from 'mobx'
import { IUserPageStore } from './types'

class UserPageStore implements IUserPageStore {
	editedUser = false

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	reset() {
		this.editedUser = false
	}

	setEditedUser(value: boolean) {
		this.editedUser = value
	}
}

export default new UserPageStore()
