import type { FC } from 'react'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/shared/ui/AlertDialog'

interface AlertDeleteProps {
	onClick?: () => void
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

export const AlertDelete: FC<AlertDeleteProps> = ({ onClick, ...props }) => {
	return (
		<AlertDialog {...props}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Вы абсолютно уверены?</AlertDialogTitle>
					<AlertDialogDescription>
						Это действие не может быть отменено. Это навсегда удалит данную
						карточку с наших серверов.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Отменить</AlertDialogCancel>
					<AlertDialogAction onClick={onClick}>Подтвердить</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
