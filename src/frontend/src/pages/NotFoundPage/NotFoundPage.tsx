import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_CONSTANTS } from '@/shared/config'
import { Button } from '@/shared/ui'
import { FuzzyText } from '@/shared/ui/Animations'

interface NotFoundPageProps { }

// TODO Сделать крутую 404

export const NotFoundPage: FC<NotFoundPageProps> = () => {
	const navigate = useNavigate()
	return (
		<main className="mx-auto flex h-full w-full max-w-layout flex-grow flex-col gap-10 pt-3">
			<div className="flex flex-grow flex-col items-center justify-center gap-5">
				<FuzzyText>
					404
				</FuzzyText>
				<p className="text-2xl font-bold">Страница не найдена</p>
				<Button size="lg" onClick={() => navigate(ROUTE_CONSTANTS.INDEX.URL)}>
					На главную страницу
				</Button>
			</div>
		</main>
	)
}
