import { Card } from '@/entities/Card'
import { FC } from 'react'

const data = [
    {
        title: "Header", description: "Subheader", avatarUrl: "", avatarFallback: "A"
    },
    {
        title: "Header", description: "Subheader", avatarUrl: "", avatarFallback: "A"
    },
    {
        title: "Header", description: "Subheader", avatarUrl: "", avatarFallback: "A"
    },
    {
        title: "Header", description: "Subheader", avatarUrl: "", avatarFallback: "A"
    },

]

export const Content: FC = () => {
    return (
        <div className='grid auto-fill-80 gap-5 px-5 cursor-pointer'>
            {data.map((data, i) => (
                <Card key={i} {...data} />
            ))}
        </div>
    )
}
