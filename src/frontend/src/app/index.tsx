import { createAxios } from '@/shared/api'
import './index.css'
import { config } from '@/shared/config'
import { withProviders } from './providers'

createAxios({
	baseURL: config.apiUrlV1,
	tokenKeyLS: config.tokenKeyLS,
})

const ProvidedApp: React.FC = withProviders(<></>)

export { ProvidedApp as App }
