import { FC } from 'react'

interface PanoramaImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const PanoramaImg: FC<PanoramaImgProps> = ({ src, ...props }) => {
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
