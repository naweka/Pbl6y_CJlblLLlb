import { FC } from 'react'
import { observer } from 'mobx-react-lite'

import { Separator } from '@/shared/ui'
import { Edit } from '@/entities/Edit'

import userPageStore from '../model/userPage.store'

interface HeaderProps { }

export const Header: FC<HeaderProps> = observer(() => {
  return (
    <div className="w-full">
      <div className="flex flex-col-reverse items-center justify-between gap-3 md:flex-row mb-4">
        <p className='text-3xl text-center sm:text-4xl sm:text-left md:text-left md:text-5xl'>Профиль пользователя</p>
        <Edit checked={userPageStore.editedUser} onCheckedChange={userPageStore.setEditedUser} />
      </div>
      <Separator />
    </div>
  )
})
