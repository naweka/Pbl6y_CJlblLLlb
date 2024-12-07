import { Upload, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { FC, useEffect } from 'react'
import { STATUS } from '@/shared/types'
import { AspectRatio, Button, Spinner } from '@/shared/ui'
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
	if (!detailPageStore.files) return <EmptyFiles />
	if (!(detailPageStore.files.length > 0)) return <EmptyFiles />
	return (
		<div className='px-5'>
			<div>
				<Button>Загрузить файл <Upload /></Button>
			</div>
			<div className="flex flex-col gap-4 py-5">
				{detailPageStore.files.map((file) => {
					return (
						<div key={file.id} className='space-y-5'>
							<div className="flex flex-row gap-4">
								<div className="flex w-full items-center overflow-hidden rounded-md border p-3 py-1" title={file.name}>
									<p className="overflow-hidden text-ellipsis whitespace-nowrap">
										{file.name}
									</p>
								</div>
								<Button variant="destructive" size="icon">
									<X />
								</Button>
							</div>
							<div className='border h-[150px] w-full rounded-md overflow-x-auto'>
								{file.url && <PanoramaImg src={URL.createObjectURL(file.url)} />}
							</div>
						</div>
					)
				})}
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
