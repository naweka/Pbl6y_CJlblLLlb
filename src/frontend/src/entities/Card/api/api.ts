/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { Card, ModelSetting } from '../types'
import { routes } from './routes'
import {
	GetAllCardData,
	GetCardData,
	GetFilesCardData,
	SendCreateCardData,
	SendUpdateCardData,
	SendUpdateModelSettingsFile,
} from './types'

export const sendCreateCard = async (data: SendCreateCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.create(), data)
}

export const getAllCard = async (data: GetAllCardData) => {
	return await http?.post<any, AxiosResponse<Card[]>>(routes.getAll(), data)
}

export const getCard = async (data: GetCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.get(), data)
}

export const deleteCard = async (id: string) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.delete(), { id })
}

export const getFilesCard = async (data: GetFilesCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.getFiles(), data)
}

export const sendUpdateCard = async (data: SendUpdateCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.update(), data)
}

export const getModelSettigsFile = async (fileId: string) => {
	return await http?.get<any, AxiosResponse<ModelSetting>>(
		routes.getSettingsFile(fileId),
	)
}

export const getModelDefaultSettingsFile = async () => {
	return await http?.get<any, AxiosResponse<ModelSetting>>(
		routes.getDefaultSettingsFile(),
	)
}

export const sendUpdateModelSettingsFile = async (
	data: SendUpdateModelSettingsFile,
) => {
	return await http?.post<any, AxiosResponse<ModelSetting>>(
		routes.updateSettingsFile(),
		data,
	)
}

export const sendUpdateModelDefaultSettingsFile = async (
	data: ModelSetting,
) => {
	return await http?.post<any, AxiosResponse<ModelSetting>>(
		routes.updateDefaultSettingsFile(),
		data,
	)
}
