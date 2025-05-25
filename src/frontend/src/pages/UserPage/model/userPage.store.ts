import { makeAutoObservable, runInAction } from 'mobx'
import {
	getModelDefaultSettingsFile,
	ModelSetting,
	sendUpdateModelDefaultSettingsFile,
} from '@/entities/Card'
import { STATUS } from '@/shared/types'
import { IUserPageStore } from './types'

class UserPageStore implements IUserPageStore {
	editedUser = false
	private _settingStatus: STATUS = STATUS.INITIAL
	private _setting: ModelSetting | null = null

	constructor() {
		makeAutoObservable(this, undefined, { autoBind: true, deep: false })
	}

	reset() {
		this.editedUser = false
	}

	setEditedUser(value: boolean) {
		this.editedUser = value
	}

	setSettingFile(data: ModelSetting) {
		this._setting = data
	}

	get getSetting() {
		return this._setting
	}

	get settingStatus() {
		return this._settingStatus
	}

	async fetchDefaultSetting() {
		this._settingStatus = STATUS.LOADING
		try {
			const res = await getModelDefaultSettingsFile()
			runInAction(() => {
				this.setSettingFile(res?.data!)
				this._settingStatus = STATUS.SUCCESS
			})
		} catch (error) {
			console.error(error)
			this._settingStatus = STATUS.ERROR
		}
	}

	async updateFileSetting(data: ModelSetting) {
		try {
			await sendUpdateModelDefaultSettingsFile(data)
			this.setSettingFile(data)
		} catch (error) {
			console.error(error)
		}
	}
}

export default new UserPageStore()
