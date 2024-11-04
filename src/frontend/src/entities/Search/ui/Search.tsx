import { cn } from '@/shared/lib'
import { Button, Input, InputGroup, InputGroupProps } from '@/shared/ui'
import { Search as SearchIcon } from 'lucide-react'
import { FC } from 'react'

interface SearchProps extends InputGroupProps {

}

export const Search: FC<SearchProps> = ({ className, ...props }) => {
    return (
        <InputGroup className={cn("max-w-80", className)} {...props}>
            <Input placeholder='Поиск' className='border-r-0 rounded-r-none' />
            <Button size="icon" variant="outline" className='border-l-0 rounded-l-none'>
                <SearchIcon />
            </Button>
        </InputGroup>
    )
}
