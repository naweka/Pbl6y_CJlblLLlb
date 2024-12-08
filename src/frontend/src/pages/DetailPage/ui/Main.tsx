import { Download, FileDown, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { STATUS } from '@/shared/types'
import { Button, Spinner, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui'
import { detailPageStore } from '../model'
import { UploadFilesCard } from '@/widgets/UploadFilesCard'

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
	return <div className="px-5">Список пустой</div>
}

interface PanoramaImgProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

const PanoramaImg: FC<PanoramaImgProps> = ({ src, ...props }) => {
	return (
		<div className='h-full overflow-x-auto' {...props}>
			<img loading="lazy" className='object-contain h-full inline-block max-w-none' src={src} />
		</div>
	)
}

const MainSuccess = observer(() => {
	return (
		<div className='px-5'>
			<div className='space-y-5'>
				{detailPageStore.files && detailPageStore.files.length > 0 && <Button>Скачать всё файлы<Download /></Button>}
				<UploadFilesCard />
			</div>
			<div className="flex flex-col gap-4 py-5">
				{detailPageStore.files && detailPageStore.files.length > 0 ? detailPageStore.files.map((file) => {
					return (
						<div key={file.id} className='space-y-5'>
							<div className="flex flex-row gap-4">
								<div className="flex w-full items-center overflow-hidden rounded-md border p-3 py-1" title={file.name}>
									<p className="overflow-hidden text-ellipsis whitespace-nowrap">
										{file.name}
									</p>
								</div>
								<TooltipProvider delayDuration={0}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="default" size="icon">
												<FileDown />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Скачать файл.</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<TooltipProvider delayDuration={0}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button variant="destructive" size="icon">
												<X />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Удалить файл.</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

							</div>
							<div className='border h-[150px] w-full rounded-md overflow-x-auto'>
								{file.url && <PanoramaImg src={URL.createObjectURL(file.url)} />}
							</div>
						</div>
					)
				}) : <EmptyFiles />}
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
