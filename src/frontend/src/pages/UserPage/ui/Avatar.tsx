import { firstChar, generateColor } from '@/shared/lib';
import { Avatar, AvatarFallback } from '@/shared/ui'
import { FC } from 'react'

interface AvatarUserProps {
  id: string
  name: string
}

export const AvatarUser: FC<AvatarUserProps> = ({ id, name }) => {
  const { color, colorLighten } = generateColor(id);
  return (
    <Avatar className='w-32 h-32'>
      <AvatarFallback
        style={{
          background: `linear-gradient(135deg, ${color} 0%, ${colorLighten} 96.52%)`
        }}
        className='text-4xl'
      >{firstChar(name)}
      </AvatarFallback>
    </Avatar>
  )
}
