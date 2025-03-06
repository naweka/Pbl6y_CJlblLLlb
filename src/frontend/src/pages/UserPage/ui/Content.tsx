import { FC } from 'react'
import { observer } from 'mobx-react-lite'

import { userStore } from '@/entities/User'

import { EditableField } from './fields/EditableField'
import userPageStore from '../model/userPage.store'
import { AvatarUser } from './Avatar'
import { Card } from '@/shared/ui'

interface ContentProps { }

export const Content: FC<ContentProps> = observer(() => {
  return (
    <div className='flex flex-col gap-1 w-full'>
      <Card className='p-4 max-w-[420px]'>
        <div className='flex justify-center sm:justify-start'>
          <AvatarUser id={userStore.currentUser?.id || ""} name={userStore.currentUser?.fullname || userStore.currentUser?.login || ""} />
        </div>
        <EditableField disabled={!userPageStore.editedUser} defaultValue={userStore.currentUser?.login} title="Логин пользователя" />
        <EditableField disabled={!userPageStore.editedUser} defaultValue={userStore.currentUser?.fullname} title="Имя пользователя" />
      </Card >
    </div>
  )
})
