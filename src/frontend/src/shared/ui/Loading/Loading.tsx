import { FC } from 'react'

interface LoadingProps {}

export const Loading: FC<LoadingProps> = () => {
	return (
		<div className="absolute z-10 flex h-[150px] w-[150px] items-center justify-center">
			<div className="absolute h-[30px] w-[50px] animate-[loadingFish1_2s_linear_infinite] rounded-[50%] bg-foreground">
				<div className="tail1 absolute left-[-15px] top-[5px] h-0 w-0 origin-center rotate-90 border-x-[12px] border-b-[22px] border-solid border-x-transparent border-b-foreground"></div>
				<div className="absolute left-[35px] top-2.5 h-1.5 w-1.5 rounded-[50%] bg-background"></div>
			</div>
			<div className="absolute h-[30px] w-[50px] animate-[loadingFish2_2s_linear_infinite] rounded-[50%] bg-foreground">
				<div className="tail2 absolute left-[-15px] top-[5px] h-0 w-0 origin-center rotate-90 border-x-[12px] border-b-[22px] border-solid border-x-transparent border-b-foreground"></div>
				<div className="absolute left-[35px] top-2.5 h-1.5 w-1.5 rounded-[50%] bg-background"></div>
			</div>
		</div>
	)
}
