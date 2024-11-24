import { FC, useState } from 'react'
import { SignIn } from './ui/SignIn'
import { SignUp } from './ui/SignUp'
import { AuthTogglers } from './authConstants'

const MapComponent = {
	SignIn,
	SignUp
}

export const Component: FC = () => {
	const [active, setActive] = useState<AuthTogglers>(AuthTogglers.SIGN_IN)
	const Component = MapComponent[active] ?? null
	if (!Component) return null

	return (
		<main className="flex-grow flex justify-center items-center my-5 px-2">
			<Component setActive={setActive} />
		</main>
	)
}
