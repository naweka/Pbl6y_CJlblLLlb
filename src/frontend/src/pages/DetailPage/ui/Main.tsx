import { Fish } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { DownloadFiles } from '@/features/Download'
import { STATUS } from '@/shared/types'
import { For, Spinner } from '@/shared/ui'
import { UploadFilesCard } from '@/widgets/UploadFilesCard'
import { detailPageStore } from '../model'
import { CardFile } from './CardFile'

interface MainProps {}

const MapComponent: Record<STATUS, FC> = {
	[STATUS.INITIAL]: () => <MainLoading />,
	[STATUS.LOADING]: () => <MainLoading />,
	[STATUS.ERROR]: () => <MainError />,
	[STATUS.SUCCESS]: () => <MainSuccess />,
}

const MainLoading = () => {
	return (
		<div className="flex w-full flex-grow items-center justify-center">
			<Spinner />
		</div>
	)
}
const MainError = () => {
	return (
		<div className="flex flex-grow items-center justify-center">
			Что-то пошло не так...
		</div>
	)
}

const EmptyFiles = () => {
	return (
		<div className="flex flex-grow flex-col items-center justify-center gap-1 px-5">
			<Fish className="h-12 w-12" />
			<p className="mb-1 text-center text-base text-foreground">
				<span>Список пустой </span>&nbsp;
				<br />
				<span>
					Нажмите <strong>"Редактировать"</strong>, чтобы загрузить новый файл
				</span>
			</p>
		</div>
	)
}

const MainSuccess = observer(() => {
	return (
		<div className="flex flex-grow flex-col px-5">
			<div className="space-y-5">
				{detailPageStore.card?.id &&
					detailPageStore.files &&
					detailPageStore.files.length > 0 && (
						<DownloadFiles cardId={detailPageStore.card?.id} />
					)}
				{detailPageStore.edit && detailPageStore.card?.id && (
					<UploadFilesCard
						onUploadFiles={(payload) => {
							detailPageStore.uploadFiles(detailPageStore.card?.id!, payload)
						}}
					/>
				)}
			</div>
			<div className="flex flex-grow flex-col gap-4 py-5">
				<For each={detailPageStore.files} fallback={<EmptyFiles />}>
					{(file) => <CardFile file={file} key={file.id} />}
				</For>
			</div>
		</div>
	)
})

export const Main: FC<MainProps> = observer(() => {
	useEffect(() => {
		detailPageStore.fetchFilesCard()
	}, [])
	const Component = MapComponent[detailPageStore.statusFiles] || null
	if (!Component) return null
	return <Component />
})
