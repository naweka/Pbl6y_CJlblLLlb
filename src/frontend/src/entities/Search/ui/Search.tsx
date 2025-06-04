import { Search as SearchIcon } from 'lucide-react'
import { FC } from 'react'
import { cn } from '@/shared/lib'
import {
	Button,
	Input,
	InputGroup,
	InputGroupProps,
	InputProps,
} from '@/shared/ui'

interface SearchProps extends InputGroupProps {
	inputProps?: InputProps
	onActon?: () => void
}

export const Search: FC<SearchProps> = ({
	className,
	inputProps,
	onActon,
	...props
}) => {
	return (
		<InputGroup className={cn('max-w-80', className)} {...props}>
			<Input
				placeholder="Поиск"
				className="rounded-r-none border-r-0"
				{...inputProps}
			/>
			<Button
				size="icon"
				variant="outline"
				className="rounded-l-none border-l-0"
				onClick={onActon}
			>
				<SearchIcon />
			</Button>
		</InputGroup>
	)
}
