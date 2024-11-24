import { Loading } from "@/entities/Loading"
import { userStore } from "@/entities/User"
import { STATUS } from "@/shared/types"
import { observer } from "mobx-react-lite"
import { FC, useEffect } from "react"

export const Component: FC = observer(() => {

    useEffect(() => {
        userStore.fetchCurrentUser()
    }, [])

    if (userStore.status === STATUS.LOADING) {
        return <Loading />
    }

    return (
        <main className="flex-grow flex-col flex justify-center items-center my-5 px-2">
            <div>{JSON.stringify(userStore.currentUser)}</div>
            <div>Профиль пользователя</div>
        </main>
    )
})