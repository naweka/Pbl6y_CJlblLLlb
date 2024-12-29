import { Fish, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { DownloadFile, DownloadFiles } from '@/features/Download'
import { STATUS } from '@/shared/types'
import {
	Button,
	For,
	Spinner,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shared/ui'
import {
	UploadFilesCard,
} from '@/widgets/UploadFilesCard'
import { detailPageStore } from '../model'

interface MainProps { }

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

interface PanoramaImgProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

const PanoramaImg: FC<PanoramaImgProps> = ({ src, ...props }) => {
	return (
		<div className="h-full overflow-x-auto" {...props}>
			<img
				loading="lazy"
				className="inline-block h-full max-w-none object-contain"
				src={src}
			/>
		</div>
	)
}

const MainSuccess = observer(() => {
	return (
		<div className="flex flex-grow flex-col px-5">
			<div className="space-y-5">
				{detailPageStore.files && detailPageStore.files.length > 0 && (
					<DownloadFiles />
				)}
				{detailPageStore.edit && detailPageStore.card?.id && (
					<UploadFilesCard
						onUploadFiles={(payload) => {
							detailPageStore.uploadFiles(
								detailPageStore.card?.id!,
								payload,
							)
						}}
					/>
				)}
			</div>
			<div className="flex flex-grow flex-col gap-4 py-5">
				<For each={detailPageStore.files} fallback={<EmptyFiles />}>
					{(file) => (
						<div key={file.id} className="space-y-5">
							<div className="flex flex-row gap-4">
								<div
									className="flex w-full items-center overflow-hidden rounded-md border p-3 py-1"
									title={file.name}
								>
									<p className="overflow-hidden text-ellipsis whitespace-nowrap">
										{file.name}
									</p>
								</div>
								{file.id && <DownloadFile fileId={file.id} />}
								<TooltipProvider delayDuration={0}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="destructive"
												className="min-w-10"
												size="icon"
											>
												<X />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Удалить файл.</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
							<div className="h-[150px] w-full overflow-x-auto rounded-md border">
								{file.url && (
									<PanoramaImg src={URL.createObjectURL(file.url)} />
								)}
							</div>
						</div>
					)}
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
