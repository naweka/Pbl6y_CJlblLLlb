import { createAxios } from '@/shared/api'
import './index.css'
import { withProviders } from './providers'
import { config } from '@/shared/config'

createAxios({
    baseURL: config.apiUrlV1,
    tokenKeyLS: config.tokenKeyLS
})

const ProvidedApp: React.FC = withProviders(<></>)

export { ProvidedApp as App }
