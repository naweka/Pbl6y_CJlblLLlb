import { Search as SearchIcon } from 'lucide-react'
import { FC } from 'react'
import { cn } from '@/shared/lib'
import { Button, Input, InputGroup, InputGroupProps } from '@/shared/ui'

interface SearchProps extends InputGroupProps {}

export const Search: FC<SearchProps> = ({ className, ...props }) => {
	return (
		<InputGroup className={cn('max-w-80', className)} {...props}>
			<Input placeholder="Поиск" className="rounded-r-none border-r-0" />
			<Button
				size="icon"
				variant="outline"
				className="rounded-l-none border-l-0"
			>
				<SearchIcon />
			</Button>
		</InputGroup>
	)
}
