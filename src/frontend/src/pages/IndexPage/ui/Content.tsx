import { FC } from 'react'
import { Card } from '@/entities/Card'

const data = [
	{
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
	{
		title: 'Header',
		description: 'Subheader',
		avatarUrl: '',
		avatarFallback: 'A',
	},
]

export const Content: FC = () => {
	return (
		<div className="grid cursor-pointer gap-5 px-5 auto-fill-80">
			{data.map((data, i) => (
				<Card key={i} {...data} />
			))}
		</div>
	)
}
