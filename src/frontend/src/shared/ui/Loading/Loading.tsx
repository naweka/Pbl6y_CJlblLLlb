import { FC } from 'react'

interface LoadingProps { }

export const Loading: FC<LoadingProps> = () => {
    return (
        <div className="absolute w-[150px] h-[150px] flex justify-center items-center z-10">
            <div className="w-[50px] h-[30px] bg-foreground absolute rounded-[50%] animate-[loadingFish1_2s_linear_infinite]">
                <div className="w-0 h-0 absolute left-[-15px] origin-center rotate-90 border-b-[22px] border-b-foreground border-x-[12px] border-x-transparent border-solid top-[5px] tail1"></div>
                <div className="w-1.5 h-1.5 bg-background absolute rounded-[50%] left-[35px] top-2.5"></div>
            </div>
            <div className="w-[50px] h-[30px] bg-foreground absolute rounded-[50%] animate-[loadingFish2_2s_linear_infinite]">
                <div className="w-0 h-0 absolute left-[-15px] origin-center rotate-90 border-b-[22px] border-b-foreground border-x-[12px] border-x-transparent border-solid top-[5px] tail2"></div>
                <div className="w-1.5 h-1.5 bg-background absolute rounded-[50%] left-[35px] top-2.5"></div>
            </div>
        </div>
    )
}
