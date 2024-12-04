import { STATUS } from '@/shared/types';
import { Card } from '../types';


export interface ITagsStore {
	status: STATUS
    cards: Card[]
}