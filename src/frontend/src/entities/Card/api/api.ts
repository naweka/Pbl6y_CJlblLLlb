import { AxiosResponse } from 'axios'
import { http } from '@/shared/api'
import { Card } from '../types'
import { routes } from './routes'
import {
	GetAllCardData,
	GetCardData,
	GetFilesCardData,
	SendCreateCardData,
	SendUpdateCardData,
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

export const getFilesCard = async (data: GetFilesCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.getFiles(), data)
}
export const sendUpdateCard = async (data: SendUpdateCardData) => {
	return await http?.post<any, AxiosResponse<Card>>(routes.update(), data)
}
