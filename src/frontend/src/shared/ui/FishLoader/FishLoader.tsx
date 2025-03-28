import { FC } from 'react'

interface FishLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FishLoader: FC<FishLoaderProps> = (props) => {
	return (
		<div
			className="relative flex h-24 w-24 items-center justify-center"
			{...props}
		>
			<style>
				{`
            @keyframes swim {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-5px); }
            }
            @keyframes bubble {
              0% { transform: translateY(0) scale(0.5); opacity: 0.8; }
              100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
            }
          `}
			</style>

			<svg
				width="64"
				height="64"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="z-10"
				style={{
					animation: 'swim 2s ease-in-out infinite',
				}}
			>
				<path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
				<path d="M18 12v.5" />
				<path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
				<path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
				<path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
				<path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
			</svg>
			<div className="absolute right-[15%]">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="absolute h-2 w-2 rounded-full bg-foreground"
						style={{
							left: `${Math.random() * 10}%`,
							bottom: '10%',
							animation: `bubble ${1 + Math.random() * 2}s ease-out infinite`,
							animationDelay: `${i * 0.3}s`,
						}}
					/>
				))}
			</div>
		</div>
	)
}
